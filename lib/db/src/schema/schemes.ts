import { jsonb, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type SchemeDocumentRecord = {
  documentType: string;
  title: string;
  reason: string;
  issuingAuthority: string | null;
};

export const schemesTable = pgTable("jansahay_schemes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  targetBeneficiaries: text("target_beneficiaries").notNull(),
  occupations: jsonb("occupations").$type<string[]>().notNull().default([]),
  state: text("state"),
  minimumAge: integer("minimum_age"),
  maximumAge: integer("maximum_age"),
  maximumAnnualIncome: integer("maximum_annual_income"),
  educationConditions: jsonb("education_conditions").$type<string[]>().notNull().default([]),
  eligibilityRules: jsonb("eligibility_rules").$type<string[]>().notNull().default([]),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  requiredDocuments: jsonb("required_documents").$type<SchemeDocumentRecord[]>().notNull().default([]),
  applicationInstructions: text("application_instructions"),
  officialSourceUrl: text("official_source_url").notNull(),
  lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
  verificationStatus: text("verification_status").notNull().default("unverified"),
  publicationStatus: text("publication_status").notNull().default("demonstration"),
  sourceKind: text("source_kind").notNull().default("demonstration"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSchemeSchema = createInsertSchema(schemesTable).omit({ updatedAt: true });
export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemesTable.$inferSelect;
