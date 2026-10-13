import { and, eq, ilike, or } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { Router, type IRouter } from "express";
import {
  GetProfileResponse,
  GetRecommendationsBody,
  GetRecommendationsResponse,
  GetSchemeDocumentsParams,
  GetSchemeDocumentsResponse,
  GetSchemeParams,
  GetSchemeResponse,
  ListSchemesQueryParams,
  ListSchemesResponse,
  SaveProfileBody,
  SaveProfileResponse,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import { citizenProfilesTable, schemesTable } from "@workspace/db";
import { requireCitizen } from "../middlewares/jansahayAuth";
import {
  evaluateScheme,
  isPublicScheme,
  profileToApi,
  schemeToApi,
  type ProfileValues,
} from "../lib/jansahay";

const router: IRouter = Router();

function inputToProfile(input: Partial<ProfileValues>): ProfileValues {
  return {
    age: input.age ?? null,
    state: input.state?.trim() || null,
    district: input.district?.trim() || null,
    occupation: input.occupation?.trim() || null,
    educationLevel: input.educationLevel?.trim() || null,
    course: input.course?.trim() || null,
    currentYear: input.currentYear ?? null,
    annualFamilyIncome: input.annualFamilyIncome ?? null,
    student: input.student ?? null,
    farmer: input.farmer ?? null,
    businessOwner: input.businessOwner ?? null,
    employmentStatus: input.employmentStatus?.trim() || null,
    socialCategory: input.socialCategory?.trim() || null,
  };
}

async function publicSchemes() {
  const all = await db.select().from(schemesTable);
  return all.filter(isPublicScheme);
}

router.get("/profile", requireCitizen, async (req, res): Promise<void> => {
  const userId = getAuth(req).userId!;
  const [profile] = await db
    .select()
    .from(citizenProfilesTable)
    .where(eq(citizenProfilesTable.userId, userId))
    .limit(1);

  res.json(GetProfileResponse.parse(profileToApi(profile)));
});

router.put("/profile", requireCitizen, async (req, res): Promise<void> => {
  const parsed = SaveProfileBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid citizen profile");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = getAuth(req).userId!;
  const profile = inputToProfile(parsed.data);
  const [saved] = await db
    .insert(citizenProfilesTable)
    .values({ userId, ...profile })
    .onConflictDoUpdate({
      target: citizenProfilesTable.userId,
      set: { ...profile, updatedAt: new Date() },
    })
    .returning();

  res.json(SaveProfileResponse.parse(profileToApi(saved)));
});

router.get("/schemes", async (req, res): Promise<void> => {
  const parsed = ListSchemesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, category } = parsed.data;
  const filters = [];
  if (search) {
    filters.push(
      or(
        ilike(schemesTable.name, `%${search}%`),
        ilike(schemesTable.description, `%${search}%`),
      ),
    );
  }
  if (category) filters.push(eq(schemesTable.category, category));

  const records = await db
    .select()
    .from(schemesTable)
    .where(filters.length ? and(...filters) : undefined);
  const visible = records.filter(isPublicScheme).map(schemeToApi);

  res.json(ListSchemesResponse.parse(visible));
});

router.get("/schemes/:schemeId", async (req, res): Promise<void> => {
  const params = GetSchemeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [scheme] = await db
    .select()
    .from(schemesTable)
    .where(eq(schemesTable.id, params.data.schemeId))
    .limit(1);
  if (!scheme || !isPublicScheme(scheme)) {
    res.status(404).json({ error: "Scheme not found." });
    return;
  }
  res.json(GetSchemeResponse.parse(schemeToApi(scheme)));
});

router.post("/recommendations", requireCitizen, async (req, res): Promise<void> => {
  const parsed = GetRecommendationsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const profile = inputToProfile(parsed.data);
  const schemes = await publicSchemes();
  const recommendations = schemes.map((scheme) => evaluateScheme(scheme, profile));
  recommendations.sort((a, b) => {
    const order = {
      strong_match: 0,
      potential_match: 1,
      more_information_required: 2,
      not_a_match: 3,
    };
    return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
  });
  res.json(GetRecommendationsResponse.parse(recommendations));
});

router.get(
  "/schemes/:schemeId/documents",
  async (req, res): Promise<void> => {
    const params = GetSchemeDocumentsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [scheme] = await db
      .select()
      .from(schemesTable)
      .where(eq(schemesTable.id, params.data.schemeId))
      .limit(1);
    if (!scheme || !isPublicScheme(scheme)) {
      res.status(404).json({ error: "Scheme not found." });
      return;
    }
    res.json(GetSchemeDocumentsResponse.parse(scheme.requiredDocuments));
  },
);

export default router;
