import { relations } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { schoolsTable } from "./schools";
import { semestersTable } from "./semesters";
import { assistantUsersTable } from "./users";

export const schoolSemesterAssistantsTable = mainSchema.table(
	"schoolAssignments",
	{
		schoolId: integer("schoolId").references(() => schoolsTable.id),
		semesterId: integer("semesterId")
			.references(() => semestersTable.id)
			.notNull(),
		assistantUserId: integer("userId")
			.references(() => assistantUsersTable.id)
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.semesterId, table.assistantUserId],
		}),
	}),
);

export const schoolSemesterAssistantsRelations = relations(
	schoolSemesterAssistantsTable,
	({ one }) => ({
		school: one(schoolsTable, {
			fields: [schoolSemesterAssistantsTable.schoolId],
			references: [schoolsTable.id],
		}),
		semester: one(semestersTable, {
			fields: [schoolSemesterAssistantsTable.semesterId],
			references: [semestersTable.id],
		}),
		assistantUser: one(assistantUsersTable, {
			fields: [schoolSemesterAssistantsTable.assistantUserId],
			references: [assistantUsersTable.id],
		}),
	}),
);
