import { assistantApplicationsTable } from "@/db/tables/applications";
import { mainSchema } from "@/db/tables/schema";
import { teamUsersTable } from "@/db/tables/users";
import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";
import { integer, json, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { interviewSchemasTable } from "./interview-schemas";

export const interviewsTable = mainSchema.table("interviews", {
	id: serial("id").primaryKey(),
	applicationId: integer("applicationId")
		.notNull()
		.references(() => assistantApplicationsTable.id),
	interviewSchemaId: integer("interviewSchemaId").notNull().references(() => interviewSchemasTable.id),
	interviewAnswers: json("interviewAnswers"),
	isCancelled: boolean("isCancelled").notNull(),
	plannedTime: timestamp("plannedTime").notNull(),
	finishedTime: timestamp("timeFinished")
});

export const interviewsRelations = relations(interviewsTable, ({ one }) => ({
	department: one(assistantApplicationsTable, {
		fields: [interviewsTable.applicationId],
		references: [assistantApplicationsTable.id],
	}),
	interviewSchema: one(interviewSchemasTable, {
		fields: [interviewsTable.interviewSchemaId],
		references: [interviewSchemasTable.id],
	})
}));

export const interviewHoldersTable = mainSchema.table("interviewHolders", {
	interviewId: integer("integerId")
		.notNull()
		.references(() => interviewsTable.id),
	interviewHolderId: integer("interviewHolderId")
		.notNull()
		.references(() => teamUsersTable.id),
}, (table) => ({
    compositePrimaryKey: primaryKey({columns: [table.interviewId, table.interviewHolderId]})
}));

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
