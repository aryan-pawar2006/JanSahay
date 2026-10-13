import { db } from "@workspace/db";
import { documentGuidesTable, schemesTable } from "@workspace/db";

export async function seedDemoData(): Promise<void> {
  const [existingSchemes] = await db
    .select({ id: schemesTable.id })
    .from(schemesTable)
    .limit(1);
  if (existingSchemes) return;

  const incomeDocument = {
    documentType: "income_certificate",
    title: "Income certificate",
    reason: "Some schemes ask for income evidence. This sample requirement is illustrative only.",
    issuingAuthority: null,
  };
  const studentDocument = {
    documentType: "bonafide_certificate",
    title: "Bonafide certificate",
    reason: "Some student schemes ask for proof of current enrollment. This sample requirement is illustrative only.",
    issuingAuthority: null,
  };

  await db.insert(schemesTable).values({
    id: "demo-student-support",
    name: "DEMO — Student support matching record",
    description:
      "Demonstration data only. This is not a real government scheme, benefit, or eligibility statement. The sample rules exist only to show how JanSahay compares a profile with stored criteria.",
    category: "Education",
    targetBeneficiaries: "Demonstration record for students",
    occupations: ["student"],
    state: "Maharashtra",
    minimumAge: 16,
    maximumAge: 30,
    maximumAnnualIncome: 250000,
    educationConditions: ["student"],
    eligibilityRules: [
      "DEMO RULE ONLY: student profile",
      "DEMO RULE ONLY: age from 16 to 30",
      "DEMO RULE ONLY: Maharashtra",
    ],
    benefits: ["No benefit information is claimed; this is demonstration data."],
    requiredDocuments: [incomeDocument, studentDocument],
    applicationInstructions: null,
    officialSourceUrl: "https://scholarships.gov.in/",
    lastVerifiedAt: null,
    verificationStatus: "unverified",
    publicationStatus: "demonstration",
    sourceKind: "demonstration",
  }).onConflictDoNothing();

  const informationNotVerified =
    "Detailed instructions have not yet been verified. Please consult the issuing authority through the official information link.";
  await db
    .insert(documentGuidesTable)
    .values([
      {
        id: "demo-income-certificate-maharashtra",
        documentType: "income_certificate",
        title: "DEMO — Income certificate guidance",
        simpleDescription:
          "Demonstration placeholder only. The state-specific issuing process has not been verified.",
        applicableState: "Maharashtra",
        issuingAuthority: null,
        eligibilityOrPrerequisites: [],
        requiredSupportingDocuments: [],
        applicationSteps: [],
        applicationMethod: "Not verified",
        officialApplicationUrl: null,
        officialInformationUrl: null,
        possibleFees: null,
        expectedProcessingTime: null,
        lastVerifiedAt: null,
        verificationStatus: "unverified",
        publicationStatus: "demonstration",
        additionalNotes: informationNotVerified,
      },
      {
        id: "demo-bonafide-certificate-maharashtra",
        documentType: "bonafide_certificate",
        title: "DEMO — Bonafide certificate guidance",
        simpleDescription:
          "Demonstration placeholder only. Ask the educational institution for its current process.",
        applicableState: "Maharashtra",
        issuingAuthority: null,
        eligibilityOrPrerequisites: [],
        requiredSupportingDocuments: [],
        applicationSteps: [],
        applicationMethod: "Not verified",
        officialApplicationUrl: null,
        officialInformationUrl: null,
        possibleFees: null,
        expectedProcessingTime: null,
        lastVerifiedAt: null,
        verificationStatus: "unverified",
        publicationStatus: "demonstration",
        additionalNotes: informationNotVerified,
      },
    ])
    .onConflictDoNothing();
}
