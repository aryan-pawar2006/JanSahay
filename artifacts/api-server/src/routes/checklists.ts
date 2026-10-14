import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { Router, type IRouter } from "express";
import {
  GetChecklistParams,
  GetChecklistResponse,
  GetPreparationDashboardResponse,
  GetSchemeReadinessParams,
  GetSchemeReadinessResponse,
  UpdateChecklistBody,
  UpdateChecklistParams,
  UpdateChecklistResponse,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  citizenProfilesTable,
  schemesTable,
  userDocumentStatusesTable,
} from "@workspace/db";
import { requireCitizen } from "../middlewares/jansahayAuth";
import {
  calculateProgress,
  evaluateScheme,
  isPublicScheme,
  profileFromDb,
  schemeToApi,
  statusCounts,
  type ChecklistStatus,
} from "../lib/jansahay";

const router: IRouter = Router();

async function getChecklistItems(userId: string, schemeId: string) {
  const [scheme] = await db
    .select()
    .from(schemesTable)
    .where(eq(schemesTable.id, schemeId))
    .limit(1);
  if (!scheme || !isPublicScheme(scheme)) return null;

  const [statuses, allSchemes] = await Promise.all([
    db
      .select()
      .from(userDocumentStatusesTable)
      .where(eq(userDocumentStatusesTable.userId, userId)),
    db.select().from(schemesTable),
  ]);
  const statusByType = new Map(statuses.map((item) => [item.documentType, item]));
  return {
    scheme,
    items: scheme.requiredDocuments.map((document) => {
      const status = statusByType.get(document.documentType);
      const relatedSchemes = allSchemes
        .filter(
          (candidate) =>
            isPublicScheme(candidate) &&
            candidate.requiredDocuments.some(
              (required) => required.documentType === document.documentType,
            ),
        )
        .map((candidate) => candidate.name);
      return {
        documentType: document.documentType,
        title: document.title,
        status: (status?.status ?? "unknown") as ChecklistStatus,
        relatedSchemes,
        updatedAt: status?.updatedAt?.toISOString() ?? null,
      };
    }),
  };
}

router.get(
  "/schemes/:schemeId/document-readiness",
  requireCitizen,
  async (req, res): Promise<void> => {
    const params = GetSchemeReadinessParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const result = await getChecklistItems(getAuth(req).userId!, params.data.schemeId);
    if (!result) {
      res.status(404).json({ error: "Scheme not found." });
      return;
    }
    const readyCount = result.items.filter((item) => item.status === "available").length;
    res.json(
      GetSchemeReadinessResponse.parse({
        schemeId: result.scheme.id,
        items: result.items,
        readyCount,
        totalCount: result.items.length,
        progressPercent: calculateProgress(readyCount, result.items.length),
      }),
    );
  },
);

router.get(
  "/checklists/:schemeId",
  requireCitizen,
  async (req, res): Promise<void> => {
    const params = GetChecklistParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const result = await getChecklistItems(getAuth(req).userId!, params.data.schemeId);
    if (!result) {
      res.status(404).json({ error: "Scheme not found." });
      return;
    }
    res.json(
      GetChecklistResponse.parse({
        schemeId: result.scheme.id,
        items: result.items,
      }),
    );
  },
);

router.put(
  "/checklists/:schemeId",
  requireCitizen,
  async (req, res): Promise<void> => {
    const params = UpdateChecklistParams.safeParse(req.params);
    const body = UpdateChecklistBody.safeParse(req.body);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    const result = await getChecklistItems(getAuth(req).userId!, params.data.schemeId);
    if (!result) {
      res.status(404).json({ error: "Scheme not found." });
      return;
    }
    const requiredTypes = new Set(result.scheme.requiredDocuments.map((item) => item.documentType));
    if (body.data.items.some((item) => !requiredTypes.has(item.documentType))) {
      res.status(400).json({ error: "Only documents required by this scheme can be updated here." });
      return;
    }

    const userId = getAuth(req).userId!;
    await db.transaction(async (tx) => {
      for (const item of body.data.items) {
        await tx
          .insert(userDocumentStatusesTable)
          .values({
            userId,
            documentType: item.documentType,
            status: item.status,
          })
          .onConflictDoUpdate({
            target: [
              userDocumentStatusesTable.userId,
              userDocumentStatusesTable.documentType,
            ],
            set: { status: item.status, updatedAt: new Date() },
          });
      }
    });

    const updated = await getChecklistItems(userId, params.data.schemeId);
    res.json(
      UpdateChecklistResponse.parse({
        schemeId: params.data.schemeId,
        items: updated?.items ?? [],
      }),
    );
  },
);

router.get(
  "/dashboard/document-preparation",
  requireCitizen,
  async (req, res): Promise<void> => {
    const userId = getAuth(req).userId!;
    const [[profile], allSchemes, statuses] = await Promise.all([
      db
        .select()
        .from(citizenProfilesTable)
        .where(eq(citizenProfilesTable.userId, userId))
        .limit(1),
      db.select().from(schemesTable),
      db
        .select()
        .from(userDocumentStatusesTable)
        .where(eq(userDocumentStatusesTable.userId, userId)),
    ]);

    const statusByType = new Map(statuses.map((item) => [item.documentType, item]));
    const candidates = profile
      ? allSchemes
          .filter(isPublicScheme)
          .map((scheme) => evaluateScheme(scheme, profileFromDb(profile)))
          .filter((result) => result.status !== "not_a_match")
      : [];
    const schemeByName = new Map(
      candidates.map((recommendation) => [
        recommendation.scheme.name,
        recommendation.scheme.id,
      ]),
    );
    const requirementByType = new Map<
      string,
      { documentType: string; title: string; relatedSchemes: Set<string> }
    >();
    for (const recommendation of candidates) {
      const source = allSchemes.find(
        (scheme) => scheme.id === recommendation.scheme.id,
      );
      for (const document of source?.requiredDocuments ?? []) {
        const existing = requirementByType.get(document.documentType);
        if (existing) {
          existing.relatedSchemes.add(recommendation.scheme.name);
        } else {
          requirementByType.set(document.documentType, {
            documentType: document.documentType,
            title: document.title,
            relatedSchemes: new Set([recommendation.scheme.name]),
          });
        }
      }
    }

    const items = Array.from(requirementByType.values()).map((item) => {
      const status = statusByType.get(item.documentType);
      return {
        documentType: item.documentType,
        title: item.title,
        status: (status?.status ?? "unknown") as ChecklistStatus,
        relatedSchemes: Array.from(item.relatedSchemes),
        updatedAt: status?.updatedAt?.toISOString() ?? null,
      };
    });
    const counts = statusCounts(items.map((item) => item.status));
    res.json(
      GetPreparationDashboardResponse.parse({
        items,
        ...counts,
        progressPercent: counts.totalCount
          ? calculateProgress(counts.readyCount, counts.totalCount)
          : 0,
      }),
    );
  },
);

export default router;
