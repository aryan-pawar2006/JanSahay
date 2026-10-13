import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { Router, type IRouter } from "express";
import {
  ExplainGuidanceBody,
  ExplainGuidanceResponse,
  GetDocumentGuideParams,
  GetDocumentGuideResponse,
  GetDocumentGuidesForTypeParams,
  GetDocumentGuidesForTypeResponse,
  ListDocumentGuidesQueryParams,
  ListDocumentGuidesResponse,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  citizenProfilesTable,
  documentGuidesTable,
  schemesTable,
} from "@workspace/db";
import { requireCitizen } from "../middlewares/jansahayAuth";
import {
  evaluateScheme,
  guideNeedsFallback,
  guideToApi,
  isPublicGuide,
  isPublicScheme,
  normalizedState,
  profileFromDb,
  schemeToApi,
} from "../lib/jansahay";

const router: IRouter = Router();

function verifiedFallback(language: string, hasInformationLink: boolean): string {
  if (language === "hi") {
    return hasInformationLink
      ? "विस्तृत निर्देश अभी सत्यापित नहीं हैं। कृपया आधिकारिक सूचना लिंक से जारी करने वाले प्राधिकरण से पुष्टि करें।"
      : "विस्तृत निर्देश अभी सत्यापित नहीं हैं। कृपया जारी करने वाले प्राधिकरण से पुष्टि करें। कोई आधिकारिक सूचना लिंक संग्रहित नहीं है।";
  }
  if (language === "mr") {
    return hasInformationLink
      ? "सविस्तर सूचना अद्याप पडताळलेल्या नाहीत. कृपया अधिकृत माहिती दुव्यावरून जारी करणाऱ्या प्राधिकरणाकडे खात्री करा."
      : "सविस्तर सूचना अद्याप पडताळलेल्या नाहीत. कृपया जारी करणाऱ्या प्राधिकरणाकडे खात्री करा. अधिकृत माहिती दुवा संग्रहित नाही.";
  }
  return hasInformationLink
    ? "Detailed instructions have not yet been verified. Please consult the issuing authority through the official information link."
    : "Detailed instructions have not yet been verified. Please consult the issuing authority through the official information link. No official information link is currently stored.";
}

router.get("/documents/guides", async (req, res): Promise<void> => {
  const parsed = ListDocumentGuidesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const records = await db.select().from(documentGuidesTable);
  const visible = records
    .filter(isPublicGuide)
    .filter((guide) =>
      parsed.data.documentType
        ? guide.documentType === parsed.data.documentType
        : true,
    )
    .filter((guide) =>
      parsed.data.state
        ? guide.applicableState === "*" ||
          normalizedState(guide.applicableState) === normalizedState(parsed.data.state)
        : true,
    )
    .filter((guide) =>
      parsed.data.verificationStatus
        ? guide.verificationStatus === parsed.data.verificationStatus
        : true,
    )
    .map(guideToApi);
  res.json(ListDocumentGuidesResponse.parse(visible));
});

router.get(
  "/documents/guides/by-type/:documentType",
  async (req, res): Promise<void> => {
    const params = GetDocumentGuidesForTypeParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const records = await db
      .select()
      .from(documentGuidesTable)
      .where(eq(documentGuidesTable.documentType, params.data.documentType));
    const visible = records.filter(isPublicGuide).map(guideToApi);
    res.json(GetDocumentGuidesForTypeResponse.parse(visible));
  },
);

router.get(
  "/documents/guides/:guideId",
  async (req, res): Promise<void> => {
    const params = GetDocumentGuideParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [guide] = await db
      .select()
      .from(documentGuidesTable)
      .where(eq(documentGuidesTable.id, params.data.guideId))
      .limit(1);
    if (!guide || !isPublicGuide(guide)) {
      res.status(404).json({ error: "Document guide not found." });
      return;
    }
    res.json(GetDocumentGuideResponse.parse(guideToApi(guide)));
  },
);

router.post("/assistant/explain", requireCitizen, async (req, res): Promise<void> => {
  const parsed = ExplainGuidanceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { question, schemeId, documentType, language } = parsed.data;
  const userId = getAuth(req).userId!;
  const [profile] = await db
    .select()
    .from(citizenProfilesTable)
    .where(eq(citizenProfilesTable.userId, userId))
    .limit(1);
  const sources: Array<{ title: string; url: string }> = [];
  const parts: string[] = [];
  let needsVerification = false;

  if (schemeId) {
    const [scheme] = await db
      .select()
      .from(schemesTable)
      .where(eq(schemesTable.id, schemeId))
      .limit(1);
    if (scheme && isPublicScheme(scheme)) {
      sources.push({ title: scheme.name, url: scheme.officialSourceUrl });
      parts.push(`Scheme record: ${scheme.name}. ${scheme.description}`);
      if (profile) {
        const evaluation = evaluateScheme(scheme, profileFromDb(profile));
        parts.push(`Current status: ${evaluation.status.replaceAll("_", " ")}.`);
        if (evaluation.matchedConditions.length) {
          parts.push(`Matched: ${evaluation.matchedConditions.join("; ")}.`);
        }
        if (evaluation.failedConditions.length) {
          parts.push(`Not matched: ${evaluation.failedConditions.join("; ")}.`);
        }
        if (evaluation.unknownConditions.length) {
          parts.push(`Still unknown: ${evaluation.unknownConditions.join("; ")}.`);
        }
      } else {
        parts.push("Save a profile to see which stored conditions match you.");
      }
      if (scheme.verificationStatus !== "verified" || scheme.sourceKind === "demonstration") {
        needsVerification = true;
        parts.push("This is unverified or demonstration data. Confirm the conditions with the official source.");
      }
    }
  }

  if (documentType) {
    const candidates = await db
      .select()
      .from(documentGuidesTable)
      .where(eq(documentGuidesTable.documentType, documentType));
    const state = normalizedState(profile?.state);
    const guide =
      candidates.find(
        (item) =>
          isPublicGuide(item) &&
          state !== null &&
          normalizedState(item.applicableState) === state,
      ) ??
      candidates.find((item) => isPublicGuide(item) && item.applicableState === "*");
    if (!guide) {
      needsVerification = true;
      parts.push(verifiedFallback(language, false));
    } else if (guideNeedsFallback(guide)) {
      needsVerification = true;
      parts.push(verifiedFallback(language, Boolean(guide.officialInformationUrl)));
      if (guide.issuingAuthority) parts.push(`Normally issued by: ${guide.issuingAuthority}.`);
    } else {
      parts.push(`${guide.title}: ${guide.simpleDescription}`);
      if (guide.issuingAuthority) parts.push(`Issuing authority: ${guide.issuingAuthority}.`);
      if (guide.requiredSupportingDocuments.length) {
        parts.push(`Supporting documents listed: ${guide.requiredSupportingDocuments.join(", ")}.`);
      }
      if (guide.applicationSteps.length) {
        parts.push(`Stored application steps: ${guide.applicationSteps.join(" ")}`);
      }
      parts.push(`Last marked verified: ${guide.lastVerifiedAt?.toISOString().slice(0, 10) ?? "date not recorded"}.`);
      if (guide.officialInformationUrl) {
        sources.push({ title: `${guide.title} official information`, url: guide.officialInformationUrl });
      }
      if (guide.officialApplicationUrl) {
        sources.push({ title: `${guide.title} application`, url: guide.officialApplicationUrl });
      }
    }
  }

  if (parts.length === 0) {
    needsVerification = true;
    parts.push(
      language === "hi"
        ? "यह सहायक केवल संग्रहित मार्गदर्शन का उपयोग करता है। कृपया किसी योजना या दस्तावेज़ का नाम बताएं।"
        : language === "mr"
          ? "हा सहाय्यक फक्त संग्रहित मार्गदर्शन वापरतो. कृपया योजना किंवा दस्तऐवजाचे नाव सांगा."
          : "This assistant uses stored guidance only. Select a scheme or document so I can use its saved information.",
    );
  }

  if (question.trim().length === 0) {
    res.status(400).json({ error: "Enter a question." });
    return;
  }
  res.json(
    ExplainGuidanceResponse.parse({
      answer: parts.join("\n\n"),
      mode: "stored_guidance_demo",
      needsVerification,
      sources,
    }),
  );
});

export default router;
