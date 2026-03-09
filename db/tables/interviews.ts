import { assistantApplicationsTable } from "@/db/tables/applications";
import { interviewSchemasTable } from "@/db/tables/interview-schemas";
import { mainSchema } from "@/db/tables/schema";
import { teamUsersTable } from "@/db/tables/users";
import type { Json } from "@/lib/json-schema";
import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";
import { boolean, integer, json, serial, timestamp } from "drizzle-orm/pg-core";

export const interviewsTable = mainSchema.table("interviews", {
	id: serial("id").primaryKey(),
	applicationId: integer("applicationId")
		.notNull()
		.references(() => assistantApplicationsTable.id),
	interviewSchemaId: integer("interviewSchemaId")
		.notNull()
		.references(() => interviewSchemasTable.id),
	interviewAnswers: json("interviewAnswers").$type<Json>(),
	isCancelled: boolean("isCancelled").notNull(),
	plannedTime: timestamp("plannedTime").notNull(),
	finishedTime: timestamp("timeFinished"),
});

export const interviewsRelations = relations(interviewsTable, ({ one }) => ({
	department: one(assistantApplicationsTable, {
		fields: [interviewsTable.applicationId],
		references: [assistantApplicationsTable.id],
	}),
	interviewSchema: one(interviewSchemasTable, {
		fields: [interviewsTable.interviewSchemaId],
		references: [interviewSchemasTable.id],
	}),
}));

export const interviewHoldersTable = mainSchema.table(
	"interviewHolders",
	{
		interviewId: integer("integerId")
			.notNull()
			.references(() => interviewsTable.id),
		interviewHolderId: integer("interviewHolderId")
			.notNull()
			.references(() => teamUsersTable.id),
	},
	(table) => ({
		compositePrimaryKey: primaryKey({
			columns: [table.interviewId, table.interviewHolderId],
		}),
	}),
);

export const interviewHoldersRelations = relations(
	interviewHoldersTable,
	({ one }) => ({
		interview: one(interviewsTable, {
			fields: [interviewHoldersTable.interviewId],
			references: [interviewsTable.id],
		}),
		interviewHolder: one(teamUsersTable, {
			fields: [interviewHoldersTable.interviewHolderId],
			references: [teamUsersTable.id],
		}),
	}),
);
