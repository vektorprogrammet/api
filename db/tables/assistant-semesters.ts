import { relations } from "drizzle-orm";
import { boolean, integer, primaryKey } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { semestersTable } from "./semesters";
import { assistantUsersTable } from "./users";

export const assistantSemestersTable = mainSchema.table(
	"assistantSemesters",
	{
		assistantId: integer("semesterId")
			.references(() => assistantUsersTable.id)
			.notNull(),
		semesterId: integer("assistantId")
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
	({ many }) => ({
		assistant: many(assistantUsersTable),
	}),
);
