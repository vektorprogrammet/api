import { date, foreignKey, integer, time } from "drizzle-orm/pg-core";
import { assistantSemestersTable } from "./assistant-semesters";
import { mainSchema } from "./schema";

export const datesTable = mainSchema.table(
	"dates",
	{
		date: date("date").notNull(),
		startTime: time("startTime").notNull(),
		endTime: time("endTime").notNull(),
		assistantId: integer("semesterId").notNull(),
		semesterId: integer("assistantId").notNull(),
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
