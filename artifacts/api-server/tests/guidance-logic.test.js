import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateProgress,
  evaluateScheme,
  isPublicGuide,
  isPublicScheme,
} from "../src/lib/jansahay.ts";

const scheme = {
  id: "sample",
  name: "Sample scheme",
  description: "A stored test record.",
  category: "Education",
  targetBeneficiaries: "Students",
  occupations: ["student"],
  state: "Maharashtra",
  minimumAge: 18,
  maximumAge: 30,
  maximumAnnualIncome: 250000,
  educationConditions: ["undergraduate"],
  eligibilityRules: [],
  benefits: [],
  requiredDocuments: [],
  applicationInstructions: null,
  officialSourceUrl: "https://example.gov.in/",
  lastVerifiedAt: new Date("2026-01-15T00:00:00.000Z"),
  verificationStatus: "verified",
  publicationStatus: "published",
  sourceKind: "curated",
};

const matchingProfile = {
  age: 22,
  state: "Maharashtra",
  district: null,
  occupation: "student",
  educationLevel: "Undergraduate",
  course: null,
  currentYear: 2,
  annualFamilyIncome: 100000,
  student: true,
  farmer: false,
  businessOwner: false,
  employmentStatus: null,
  socialCategory: null,
};

test("fully known profile receives an explained strong match", () => {
  const result = evaluateScheme(scheme, matchingProfile);
  assert.equal(result.status, "strong_match");
  assert.equal(result.failedConditions.length, 0);
  assert.ok(result.matchedConditions.length >= 4);
  assert.equal(result.unknownConditions.length, 0);
});

test("missing profile details stay unknown and unverified demo data is not called a strong match", () => {
  const result = evaluateScheme(
    { ...scheme, verificationStatus: "unverified", sourceKind: "demonstration" },
    { ...matchingProfile, age: null, annualFamilyIncome: null },
  );
  assert.equal(result.status, "more_information_required");
  assert.ok(result.unknownConditions.some((item) => item.includes("Age")));
  assert.ok(result.unknownConditions.some((item) => item.includes("income")));
  assert.ok(result.unknownConditions.some((item) => item.includes("demonstration")));
});

test("known conflicting state and income rules produce a not-a-match result", () => {
  const result = evaluateScheme(scheme, {
    ...matchingProfile,
    state: "Gujarat",
    annualFamilyIncome: 300000,
  });
  assert.equal(result.status, "not_a_match");
  assert.equal(result.failedConditions.length, 2);
});

test("document preparation progress counts only documents marked available", () => {
  assert.equal(calculateProgress(2, 3), 67);
  assert.equal(calculateProgress(0, 0), 0);
});

test("public catalogs include published and demonstration records but exclude drafts and archives", () => {
  assert.equal(isPublicScheme({ ...scheme, publicationStatus: "published" }), true);
  assert.equal(isPublicScheme({ ...scheme, publicationStatus: "demonstration" }), true);
  assert.equal(isPublicScheme({ ...scheme, publicationStatus: "draft" }), false);
  assert.equal(
    isPublicGuide({ publicationStatus: "demonstration" }),
    true,
  );
  assert.equal(isPublicGuide({ publicationStatus: "archived" }), false);
});
