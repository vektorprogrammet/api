import { relations } from "drizzle-orm";
import { foreignKey, integer, primaryKey } from "drizzle-orm/pg-core";
import { assistantSemestersTable } from "./assistant-semesters";
import { mainSchema } from "./schema";
import { schoolsTable } from "./schools";
import { semestersTable } from "./semesters";
import { assistantUsersTable } from "./users";

export const schoolSemesterAssistantsTable = mainSchema.table(
	"schoolSemesterAssistants",
	{
		schoolId: integer("schoolId").references(() => schoolsTable.id),
		semesterId: integer("semesterId")
			.references(() => assistantSemestersTable.semesterId)
			.notNull(),
		assistantUserId: integer("userId")
			.references(() => assistantSemestersTable.assistantId)
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.semesterId, table.assistantUserId, table.schoolId],
		}),
		assistantSemesterFk: foreignKey({
			columns: [table.semesterId, table.assistantUserId],
			foreignColumns: [
				assistantSemestersTable.semesterId,
				assistantSemestersTable.assistantId,
			],
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
