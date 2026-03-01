import { relations } from "drizzle-orm";
import { date, foreignKey, integer, serial, time } from "drizzle-orm/pg-core";
import { assistantSemestersTable } from "./assistant-semesters";
import { mainSchema } from "./schema";
import { semestersTable } from "./semesters";
import { assistantUsersTable } from "./users";

export const schoolAssignmentsTable = mainSchema.table(
	"schoolAssignments",
	{
		id: serial("id").primaryKey(),
		date: date("date").notNull(),
		startTime: time("startTime").notNull(),
		endTime: time("endTime").notNull(),
		assistantId: integer("semesterId")
			.notNull()
			.references(() => assistantUsersTable.id),
		semesterId: integer("assistantId")
			.notNull()
			.references(() => semestersTable.id),
	},
	(table) => ({
		assistantSemesterFk: foreignKey({
			columns: [table.assistantId, table.semesterId],
			foreignColumns: [
				assistantSemestersTable.assistantId,
				assistantSemestersTable.semesterId,
			],
		}),
	}),
);

export const schoolAssignmentsRelations = relations(
	schoolAssignmentsTable,
	({ one }) => ({
		assistantSemester: one(assistantSemestersTable, {
			fields: [
				schoolAssignmentsTable.assistantId,
				schoolAssignmentsTable.semesterId,
			],
			references: [
				assistantSemestersTable.assistantId,
				assistantSemestersTable.semesterId,
			],
		}),
		assistant: one(assistantUsersTable, {
			fields: [schoolAssignmentsTable.assistantId],
			references: [assistantUsersTable.id],
		}),
		semester: one(semestersTable, {
			fields: [schoolAssignmentsTable.semesterId],
			references: [semestersTable.id],
		}),
	}),
);
