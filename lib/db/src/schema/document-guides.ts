import { jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const documentGuidesTable = pgTable(
  "jansahay_document_guides",
  {
    id: text("id").primaryKey(),
    documentType: text("document_type").notNull(),
    title: text("title").notNull(),
    simpleDescription: text("simple_description").notNull(),
    applicableState: text("applicable_state").notNull().default("*"),
    issuingAuthority: text("issuing_authority"),
    eligibilityOrPrerequisites: jsonb("eligibility_or_prerequisites").$type<string[]>().notNull().default([]),
    requiredSupportingDocuments: jsonb("required_supporting_documents").$type<string[]>().notNull().default([]),
    applicationSteps: jsonb("application_steps").$type<string[]>().notNull().default([]),
    applicationMethod: text("application_method").notNull().default("Not verified"),
    officialApplicationUrl: text("official_application_url"),
    officialInformationUrl: text("official_information_url"),
    possibleFees: text("possible_fees"),
    expectedProcessingTime: text("expected_processing_time"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    verificationStatus: text("verification_status").notNull().default("unverified"),
    publicationStatus: text("publication_status").notNull().default("draft"),
    additionalNotes: text("additional_notes").notNull().default(""),
    verifiedBy: text("verified_by"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("jansahay_document_guides_type_jurisdiction_unique").on(
      table.documentType,
      table.applicableState,
    ),
  ],
);

export const insertDocumentGuideSchema = createInsertSchema(documentGuidesTable).omit({ updatedAt: true });
export type InsertDocumentGuide = z.infer<typeof insertDocumentGuideSchema>;
export type DocumentGuide = typeof documentGuidesTable.$inferSelect;
