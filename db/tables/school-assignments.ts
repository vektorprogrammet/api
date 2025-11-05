import { relations } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { schoolsTable } from "./schools";
import { semestersTable } from "./semesters";
import { assistantUsersTable } from "./users";

export const schoolAssignmentsTable = mainSchema.table(
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

export const schoolAssignmentsRelations = relations(
	schoolAssignmentsTable,
	({ one }) => ({
		school: one(schoolsTable, {
			fields: [schoolAssignmentsTable.schoolId],
			references: [schoolsTable.id],
		}),
		semester: one(semestersTable, {
			fields: [schoolAssignmentsTable.semesterId],
			references: [semestersTable.id],
		}),
		assistantUser: one(assistantUsersTable, {
			fields: [schoolAssignmentsTable.assistantUserId],
			references: [assistantUsersTable.id],
		}),
	}),
);
