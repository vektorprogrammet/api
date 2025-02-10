import mainSchema from "@db/tables/schema";
import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

import { teamsTable } from "@db/tables/team";
import { fieldsOfStudyTable } from "./fieldsOfStudy";

export const teamApplicationsTable = mainSchema.table("teamApplications", {
	id: serial("id").primaryKey(),
	teamId: integer("teamId")
		.notNull()
		.references(() => teamsTable.id),
	name: text("name").notNull(),
	email: text("email").notNull(),
	motivationText: text("motivationText").notNull(),
	fieldOfStudyId: integer("fieldOfStudy")
		.notNull()
		.references(() => fieldsOfStudyTable.id),
	yearOfStudy: integer("yearOfStudy").notNull(),
	biography: text("biography").notNull(),
	phonenumber: text("phonenumber").notNull(),
});

export const teamApplicationsRelations = relations(
	teamApplicationsTable,
	({ one }) => ({
		team: one(teamsTable, {
			fields: [teamApplicationsTable.teamId],
			references: [teamsTable.id],
		}),
		fieldOfStudy: one(fieldsOfStudyTable, {
			fields: [teamApplicationsTable.fieldOfStudyId],
			references: [fieldsOfStudyTable.id],
		}),
	}),
);
