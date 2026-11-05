import { fieldsOfStudyTable } from "@/db/tables/fields-of-study";
import { mainSchema } from "@/db/tables/schema";
import { teamsTable } from "@/db/tables/teams";
import { relations } from "drizzle-orm";
import { serial, text } from "drizzle-orm/pg-core";
import { semestersTable } from "./semesters";

export const departmentsTable = mainSchema.table("departments", {
	id: serial("id").primaryKey(),
	city: text("city").notNull().unique(),
	slug: text("slug").notNull().unique(),
});

export const departmentsRelations = relations(departmentsTable, ({ many }) => ({
	fieldsOfStudy: many(fieldsOfStudyTable),
	teams: many(teamsTable),
	semesters: many(semestersTable),
}));
