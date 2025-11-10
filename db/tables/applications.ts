import { mainSchema } from "@/db/tables/schema";
import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	primaryKey,
	serial,
	text,
} from "drizzle-orm/pg-core";

import { teamsTable } from "@/db/tables/teams";
import { fieldsOfStudyTable } from "./fields-of-study";
import { interviewsTable } from "./interviews";
import { semestersTable } from "./semesters";

export const gendersEnum = mainSchema.enum("gender", [
	"female",
	"male",
	"other",
]);

export const applicationsTable = mainSchema.table("applications", {
	id: serial("id").primaryKey(),
	firstName: text("firstname").notNull(),
	lastName: text("lastname").notNull(),
	gender: gendersEnum("gender").notNull(),
	email: text("email").notNull(),
	fieldOfStudyId: integer("fieldOfStudyId")
		.notNull()
		.references(() => fieldsOfStudyTable.id),
	yearOfStudy: integer("yearOfStudy").notNull(),
	phonenumber: text("phonenumber").notNull(),
	semester: integer("semester")
		.notNull()
		.references(() => semestersTable.id),
	submitDate: date("submitDate", { mode: "date" }).defaultNow().notNull(),
});

export const applicationsRelations = relations(
	applicationsTable,
	({ one, many }) => ({
		fieldOfStudy: one(fieldsOfStudyTable, {
			fields: [applicationsTable.fieldOfStudyId],
			references: [fieldsOfStudyTable.id],
		}),
		semesters: one(semestersTable, {
			fields: [applicationsTable.semester],
			references: [semestersTable.id],
		}),
		assistantApplication: one(assistantApplicationsTable, {
			fields: [applicationsTable.id],
			references: [assistantApplicationsTable.id],
		}),
		teamApplication: many(teamApplicationsTable),
	}),
);

export const teamApplicationsTable = mainSchema.table(
	"teamApplications",
	{
		id: serial("id"),
		applicationParentId: integer("applicationParentId").references(
			() => applicationsTable.id,
		),
		teamId: integer("teamId")
			.notNull()
			.references(() => teamsTable.id),
		motivationText: text("motivationText"),
		biography: text("biography"),
		teamInterest: boolean("teamInterest").notNull(),
	},
	(table) => ({
		primaryKey: primaryKey({ columns: [table.id, table.applicationParentId] }),
	}),
);

export const teamApplicationsRelations = relations(
	teamApplicationsTable,
	({ one }) => ({
		superApplication: one(applicationsTable, {
			fields: [teamApplicationsTable.id],
			references: [applicationsTable.id],
		}),
		team: one(teamsTable, {
			fields: [teamApplicationsTable.teamId],
			references: [teamsTable.id],
		}),
	}),
);

export const assistantApplicationsTable = mainSchema.table(
	"assistantApplications",
	{
		id: integer("id")
			.primaryKey()
			.references(() => applicationsTable.id),
	},
);

export const assistantApplicationsRelations = relations(
	assistantApplicationsTable,
	({ one }) => ({
		superApplication: one(applicationsTable, {
			fields: [assistantApplicationsTable.id],
			references: [applicationsTable.id],
		}),
		interview: one(interviewsTable),
	}),
);
