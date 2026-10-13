import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userDocumentStatusesTable = pgTable(
  "jansahay_user_document_statuses",
  {
    userId: text("user_id").notNull(),
    documentType: text("document_type").notNull(),
    status: text("status").notNull().default("unknown"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.documentType] })],
);

export const insertUserDocumentStatusSchema = createInsertSchema(userDocumentStatusesTable).omit({ updatedAt: true });
export type InsertUserDocumentStatus = z.infer<typeof insertUserDocumentStatusSchema>;
export type UserDocumentStatus = typeof userDocumentStatusesTable.$inferSelect;
