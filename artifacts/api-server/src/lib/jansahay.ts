import type {
  Scheme,
  DocumentGuide as DbDocumentGuide,
  CitizenProfile as DbCitizenProfile,
} from "@workspace/db";

export type ProfileValues = {
  age: number | null;
  state: string | null;
  district: string | null;
  occupation: string | null;
  educationLevel: string | null;
  course: string | null;
  currentYear: number | null;
  annualFamilyIncome: number | null;
  student: boolean | null;
  farmer: boolean | null;
  businessOwner: boolean | null;
  employmentStatus: string | null;
  socialCategory: string | null;
};

export function profileFromDb(profile?: DbCitizenProfile | null): ProfileValues {
  return {
    age: profile?.age ?? null,
    state: profile?.state ?? null,
    district: profile?.district ?? null,
    occupation: profile?.occupation ?? null,
    educationLevel: profile?.educationLevel ?? null,
    course: profile?.course ?? null,
    currentYear: profile?.currentYear ?? null,
    annualFamilyIncome: profile?.annualFamilyIncome ?? null,
    student: profile?.student ?? null,
    farmer: profile?.farmer ?? null,
    businessOwner: profile?.businessOwner ?? null,
    employmentStatus: profile?.employmentStatus ?? null,
    socialCategory: profile?.socialCategory ?? null,
  };
}

export function profileToApi(profile?: DbCitizenProfile | null) {
  return {
    ...profileFromDb(profile),
    updatedAt: profile?.updatedAt ?? new Date(),
  };
}

export function schemeToApi(scheme: Scheme) {
  return {
    ...scheme,
    lastVerifiedAt: scheme.lastVerifiedAt ?? null,
  };
}

export function guideToApi(guide: DbDocumentGuide, forAdmin = false) {
  return {
    ...guide,
    issuingAuthority: guide.issuingAuthority ?? null,
    officialApplicationUrl: guide.officialApplicationUrl ?? null,
    officialInformationUrl: guide.officialInformationUrl ?? null,
    possibleFees:
      forAdmin || guide.verificationStatus === "verified"
        ? guide.possibleFees ?? null
        : null,
    expectedProcessingTime:
      forAdmin || guide.verificationStatus === "verified"
        ? guide.expectedProcessingTime ?? null
        : null,
    lastVerifiedAt: guide.lastVerifiedAt ?? null,
  };
}

export type ChecklistStatus = "unknown" | "available" | "missing" | "needs_verification";

export function calculateProgress(readyCount: number, totalCount: number): number {
  return totalCount === 0 ? 0 : Math.round((readyCount / totalCount) * 100);
}

export function isPublicScheme(scheme: Scheme): boolean {
  return scheme.publicationStatus === "published" || scheme.publicationStatus === "demonstration";
}

export function isPublicGuide(guide: DbDocumentGuide): boolean {
  return guide.publicationStatus === "published" || guide.publicationStatus === "demonstration";
}

export function normalizedState(value: string | null | undefined): string | null {
  const cleaned = value?.trim().toLocaleLowerCase("en-IN");
  return cleaned || null;
}

function readableLimit(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function evaluateScheme(scheme: Scheme, profile: ProfileValues) {
  const matchedConditions: string[] = [];
  const failedConditions: string[] = [];
  const unknownConditions: string[] = [];

  if (scheme.minimumAge !== null || scheme.maximumAge !== null) {
    if (profile.age === null) {
      unknownConditions.push("Age has not been provided.");
    } else if (
      (scheme.minimumAge !== null && profile.age < scheme.minimumAge) ||
      (scheme.maximumAge !== null && profile.age > scheme.maximumAge)
    ) {
      const range =
        scheme.minimumAge !== null && scheme.maximumAge !== null
          ? `${scheme.minimumAge}–${scheme.maximumAge}`
          : scheme.minimumAge !== null
            ? `${scheme.minimumAge} or older`
            : `up to ${scheme.maximumAge}`;
      failedConditions.push(`Age ${profile.age} is outside the stated range (${range}).`);
    } else {
      matchedConditions.push("Age is within the stored range.");
    }
  }

  if (scheme.state) {
    if (!profile.state) {
      unknownConditions.push("State has not been provided.");
    } else if (normalizedState(profile.state) !== normalizedState(scheme.state)) {
      failedConditions.push(`The stored record applies to ${scheme.state}, not ${profile.state}.`);
    } else {
      matchedConditions.push(`State matches ${scheme.state}.`);
    }
  }

  if (scheme.maximumAnnualIncome !== null) {
    if (profile.annualFamilyIncome === null) {
      unknownConditions.push("Approximate annual family income has not been provided.");
    } else if (profile.annualFamilyIncome > scheme.maximumAnnualIncome) {
      failedConditions.push(
        `Annual family income is above the stored limit of ${readableLimit(scheme.maximumAnnualIncome)}.`,
      );
    } else {
      matchedConditions.push("Annual family income is within the stored limit.");
    }
  }

  const occupationAliases: Record<string, boolean | null> = {
    student: profile.student,
    farmer: profile.farmer,
    "business owner": profile.businessOwner,
    entrepreneur: profile.businessOwner,
    employed: profile.employmentStatus === null ? null : profile.employmentStatus === "employed",
    unemployed: profile.employmentStatus === null ? null : profile.employmentStatus === "unemployed",
  };
  for (const target of scheme.occupations) {
    const key = target.trim().toLocaleLowerCase("en-IN");
    const flag = occupationAliases[key];
    if (flag === null || flag === undefined) {
      if (profile.occupation?.toLocaleLowerCase("en-IN") === key) {
        matchedConditions.push(`Occupation matches ${target}.`);
      } else if (!profile.occupation) {
        unknownConditions.push(`Occupation (${target}) has not been confirmed.`);
      } else {
        failedConditions.push(`The stored record targets ${target}.`);
      }
    } else if (flag) {
      matchedConditions.push(`Occupation matches ${target}.`);
    } else {
      failedConditions.push(`The stored record targets ${target}.`);
    }
  }

  if (scheme.educationConditions.length > 0) {
    const education = [profile.educationLevel, profile.course]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("en-IN");
    if (!education) {
      unknownConditions.push("Education details have not been provided.");
    } else if (
      scheme.educationConditions.some((condition) =>
        education.includes(condition.toLocaleLowerCase("en-IN")),
      )
    ) {
      matchedConditions.push("Education details match a stored condition.");
    } else {
      failedConditions.push("Education details do not match the stored conditions.");
    }
  }

  if (scheme.verificationStatus !== "verified" || scheme.sourceKind === "demonstration") {
    unknownConditions.push(
      "This record is unverified or for demonstration only. Confirm every rule with the official source.",
    );
  }

  const status =
    failedConditions.length > 0
      ? "not_a_match"
      : unknownConditions.length > 0
        ? "more_information_required"
        : matchedConditions.length >= 2
          ? "strong_match"
          : "potential_match";

  return {
    scheme: schemeToApi(scheme),
    status,
    matchedConditions,
    failedConditions,
    unknownConditions,
  };
}

export function statusCounts(statuses: ChecklistStatus[]) {
  const readyCount = statuses.filter((status) => status === "available").length;
  return {
    readyCount,
    missingCount: statuses.filter((status) => status === "missing").length,
    unknownCount: statuses.filter(
      (status) => status === "unknown" || status === "needs_verification",
    ).length,
    totalCount: statuses.length,
    progressPercent: calculateProgress(readyCount, statuses.length),
  };
}

export function guideNeedsFallback(guide: DbDocumentGuide): boolean {
  return guide.verificationStatus !== "verified" || guide.applicationSteps.length === 0;
}
