import { relations } from "drizzle-orm";
import { boolean, integer, primaryKey } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { semestersTable } from "./semesters";
import { assistantUsersTable } from "./users";

export const assistantSemestersTable = mainSchema.table(
	"assistantSemesters",
	{
		assistantId: integer("assistantId")
			.references(() => assistantUsersTable.id)
			.notNull(),
		semesterId: integer("semesterId")
			.references(() => semestersTable.id)
			.notNull(),
		isSubstitute: boolean("isSubstitute").notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.assistantId, table.semesterId],
		}),
	}),
);

export const assistantSemestersRelations = relations(
	assistantSemestersTable,
	({ one }) => ({
		assistant: one(assistantUsersTable, {
			fields: [assistantSemestersTable.assistantId],
			references: [assistantUsersTable.id],
		}),
		semester: one(semestersTable, {
			fields: [assistantSemestersTable.semesterId],
			references: [semestersTable.id],
		}),
	}),
);
