import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import {
  ArchiveDocumentGuideParams,
  ArchiveDocumentGuideResponse,
  CreateDocumentGuideBody,
  CreateDocumentGuideResponse,
  GetGuideReferencesParams,
  GetGuideReferencesResponse,
  ListAdminDocumentGuidesResponse,
  PublishDocumentGuideParams,
  PublishDocumentGuideResponse,
  UpdateDocumentGuideBody,
  UpdateDocumentGuideParams,
  UpdateDocumentGuideResponse,
  VerifyDocumentGuideBody,
  VerifyDocumentGuideParams,
  VerifyDocumentGuideResponse,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import { documentGuidesTable, schemesTable } from "@workspace/db";
import { requireJanSahayAdmin } from "../middlewares/jansahayAuth";
import { guideToApi, schemeToApi } from "../lib/jansahay";

const router: IRouter = Router();

async function findGuide(guideId: string) {
  const [guide] = await db
    .select()
    .from(documentGuidesTable)
    .where(eq(documentGuidesTable.id, guideId))
    .limit(1);
  return guide;
}

function normalizedGuideInput(input: {
  documentType: string;
  title: string;
  simpleDescription: string;
  applicableState: string;
  issuingAuthority?: string | null;
  eligibilityOrPrerequisites: string[];
  requiredSupportingDocuments: string[];
  applicationSteps: string[];
  applicationMethod: string;
  officialApplicationUrl?: string | null;
  officialInformationUrl?: string | null;
  possibleFees?: string | null;
  expectedProcessingTime?: string | null;
  additionalNotes: string;
}) {
  return {
    documentType: input.documentType.trim().toLocaleLowerCase("en-IN").replaceAll(" ", "_"),
    title: input.title.trim(),
    simpleDescription: input.simpleDescription.trim(),
    applicableState: input.applicableState.trim() || "*",
    issuingAuthority: input.issuingAuthority?.trim() || null,
    eligibilityOrPrerequisites: input.eligibilityOrPrerequisites.map((item) => item.trim()).filter(Boolean),
    requiredSupportingDocuments: input.requiredSupportingDocuments.map((item) => item.trim()).filter(Boolean),
    applicationSteps: input.applicationSteps.map((item) => item.trim()).filter(Boolean),
    applicationMethod: input.applicationMethod.trim() || "Not verified",
    officialApplicationUrl: input.officialApplicationUrl?.trim() || null,
    officialInformationUrl: input.officialInformationUrl?.trim() || null,
    possibleFees: input.possibleFees?.trim() || null,
    expectedProcessingTime: input.expectedProcessingTime?.trim() || null,
    additionalNotes: input.additionalNotes.trim(),
  };
}

router.get(
  "/admin/document-guides",
  requireJanSahayAdmin,
  async (_req, res): Promise<void> => {
    const guides = await db.select().from(documentGuidesTable);
    res.json(
      ListAdminDocumentGuidesResponse.parse(
        guides.map((guide) => guideToApi(guide, true)),
      ),
    );
  },
);

router.post(
  "/admin/document-guides",
  requireJanSahayAdmin,
  async (req, res): Promise<void> => {
    const parsed = CreateDocumentGuideBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const values = normalizedGuideInput(parsed.data);
    try {
      const [guide] = await db
        .insert(documentGuidesTable)
        .values({
          id: randomUUID(),
          ...values,
          lastVerifiedAt: null,
          verificationStatus: "unverified",
          publicationStatus: "draft",
        })
        .returning();
      res
        .status(201)
        .json(CreateDocumentGuideResponse.parse(guideToApi(guide, true)));
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        res.status(409).json({
          error: "A guide already exists for this document type and jurisdiction.",
        });
        return;
      }
      throw error;
    }
  },
);

router.patch(
  "/admin/document-guides/:guideId",
  requireJanSahayAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateDocumentGuideParams.safeParse(req.params);
    const body = UpdateDocumentGuideBody.safeParse(req.body);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }
    const current = await findGuide(params.data.guideId);
    if (!current) {
      res.status(404).json({ error: "Document guide not found." });
      return;
    }
    if (body.data.verificationStatus === "verified") {
      res.status(400).json({
        error: "Use the verification action with an official source and review date.",
      });
      return;
    }

    const values = normalizedGuideInput(body.data);
    const verificationStatus = body.data.verificationStatus ?? "unverified";
    try {
      const [guide] = await db
        .update(documentGuidesTable)
        .set({
          ...values,
          verificationStatus,
          lastVerifiedAt: verificationStatus === "outdated" ? current.lastVerifiedAt : null,
          verifiedBy: verificationStatus === "outdated" ? current.verifiedBy : null,
          updatedAt: new Date(),
        })
        .where(eq(documentGuidesTable.id, params.data.guideId))
        .returning();
      res.json(UpdateDocumentGuideResponse.parse(guideToApi(guide, true)));
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        res.status(409).json({
          error: "A guide already exists for this document type and jurisdiction.",
        });
        return;
      }
      throw error;
    }
  },
);

router.get(
  "/admin/document-guides/:guideId/references",
  requireJanSahayAdmin,
  async (req, res): Promise<void> => {
    const params = GetGuideReferencesParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const guide = await findGuide(params.data.guideId);
    if (!guide) {
      res.status(404).json({ error: "Document guide not found." });
      return;
    }
    const schemes = await db.select().from(schemesTable);
    const references = schemes.filter((scheme) =>
      scheme.requiredDocuments.some(
        (item) => item.documentType === guide.documentType,
      ),
    );
    res.json(GetGuideReferencesResponse.parse(references.map(schemeToApi)));
  },
);

router.post(
  "/admin/document-guides/:guideId/verify",
  requireJanSahayAdmin,
  async (req, res): Promise<void> => {
    const params = VerifyDocumentGuideParams.safeParse(req.params);
    const body = VerifyDocumentGuideBody.safeParse(req.body);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }
    const current = await findGuide(params.data.guideId);
    if (!current) {
      res.status(404).json({ error: "Document guide not found." });
      return;
    }
    if (body.data.lastVerifiedAt.getTime() > Date.now()) {
      res.status(400).json({ error: "The verification date cannot be in the future." });
      return;
    }
    const userId = getAuth(req).userId!;
    const [guide] = await db
      .update(documentGuidesTable)
      .set({
        officialInformationUrl: body.data.officialSourceUrl,
        lastVerifiedAt: body.data.lastVerifiedAt,
        verificationStatus: "verified",
        verifiedBy: userId,
        additionalNotes: body.data.additionalNotes ?? current.additionalNotes,
        updatedAt: new Date(),
      })
      .where(eq(documentGuidesTable.id, params.data.guideId))
      .returning();
    res.json(VerifyDocumentGuideResponse.parse(guideToApi(guide, true)));
  },
);

router.post(
  "/admin/document-guides/:guideId/publish",
  requireJanSahayAdmin,
  async (req, res): Promise<void> => {
    const params = PublishDocumentGuideParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const current = await findGuide(params.data.guideId);
    if (!current) {
      res.status(404).json({ error: "Document guide not found." });
      return;
    }
    const [guide] = await db
      .update(documentGuidesTable)
      .set({ publicationStatus: "published", updatedAt: new Date() })
      .where(eq(documentGuidesTable.id, params.data.guideId))
      .returning();
    res.json(PublishDocumentGuideResponse.parse(guideToApi(guide, true)));
  },
);

router.post(
  "/admin/document-guides/:guideId/archive",
  requireJanSahayAdmin,
  async (req, res): Promise<void> => {
    const params = ArchiveDocumentGuideParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const current = await findGuide(params.data.guideId);
    if (!current) {
      res.status(404).json({ error: "Document guide not found." });
      return;
    }
    const [guide] = await db
      .update(documentGuidesTable)
      .set({ publicationStatus: "archived", updatedAt: new Date() })
      .where(eq(documentGuidesTable.id, params.data.guideId))
      .returning();
    res.json(ArchiveDocumentGuideResponse.parse(guideToApi(guide, true)));
  },
);

export default router;
