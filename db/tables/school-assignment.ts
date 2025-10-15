import { relations } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { schoolsTable } from "./schools";
import { semestersTable } from "./semesters";
import { assistantUsersTable } from "./users";

export const schoolAssignmentTable = mainSchema.table(
	"schoolAssignment",
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

export const schoolAssignmentRelations = relations(
	schoolAssignmentTable,
	({ one }) => ({
		school: one(schoolsTable, {
			fields: [schoolAssignmentTable.schoolId],
			references: [schoolsTable.id],
		}),
		semester: one(semestersTable, {
			fields: [schoolAssignmentTable.semesterId],
			references: [semestersTable.id],
		}),
		assistantUser: one(assistantUsersTable, {
			fields: [schoolAssignmentTable.assistantUserId],
			references: [assistantUsersTable.id],
		}),
	}),
);
