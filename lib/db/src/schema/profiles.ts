import { pgTable, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const citizenProfilesTable = pgTable("jansahay_citizen_profiles", {
  userId: text("user_id").primaryKey(),
  age: integer("age"),
  state: text("state"),
  district: text("district"),
  occupation: text("occupation"),
  educationLevel: text("education_level"),
  course: text("course"),
  currentYear: integer("current_year"),
  annualFamilyIncome: integer("annual_family_income"),
  student: boolean("student"),
  farmer: boolean("farmer"),
  businessOwner: boolean("business_owner"),
  employmentStatus: text("employment_status"),
  socialCategory: text("social_category"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCitizenProfileSchema = createInsertSchema(citizenProfilesTable).omit({ updatedAt: true });
export type InsertCitizenProfile = z.infer<typeof insertCitizenProfileSchema>;
export type CitizenProfile = typeof citizenProfilesTable.$inferSelect;
