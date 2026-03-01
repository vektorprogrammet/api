import { relations } from "drizzle-orm";
import { foreignKey, integer, primaryKey } from "drizzle-orm/pg-core";
import { assistantSemestersTable } from "./assistant-semesters";
import { mainSchema } from "./schema";
import { schoolsTable } from "./schools";

export const schoolSemesterAssistantsTable = mainSchema.table(
	"schoolSemesterAssistants",
	{
		schoolId: integer("schoolId")
			.references(() => schoolsTable.id)
			.notNull(),
		semesterId: integer("semesterId")
			.references(() => assistantSemestersTable.semesterId)
			.notNull(),
		assistantUserId: integer("assistantUserId")
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
		assistantSemester: one(assistantSemestersTable, {
			fields: [
				schoolSemesterAssistantsTable.semesterId,
				schoolSemesterAssistantsTable.assistantUserId,
			],
			references: [
				assistantSemestersTable.semesterId,
				assistantSemestersTable.assistantId,
			],
		}),
	}),
);
