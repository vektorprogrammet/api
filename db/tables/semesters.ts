import { relations } from "drizzle-orm";
import { date, foreignKey, integer, serial, text } from "drizzle-orm/pg-core";
import { departmentsTable } from "./departments";
import { mainSchema } from "./schema";

export const semestersTable = mainSchema.table(
	"semesters",
	{
		id: serial("id").primaryKey(),
		lastSemesterId: integer("lastSemesterId"),
		semesterStartDate: date("semesterStartDate").notNull(),
		semesterEndDate: date("semesterEndDate").notNull(),
		recruitmentStartDate: date("recruitmentStartDate").notNull(),
		recruitmentEndDate: date("recruitmentEndDate").notNull(),
		departmentId: integer("departmentId")
			.notNull()
			.references(() => departmentsTable.id),
		name: text("name").notNull(),
	},
	(table) => {
		return {
			parentReference: foreignKey({
				columns: [table.departmentId],
				foreignColumns: [table.id],
			}),
		};
	},
);

export const semestersRelations = relations(semestersTable, ({ one }) => ({
	department: one(departmentsTable, {
		fields: [semestersTable.departmentId],
		references: [departmentsTable.id],
	}),
	semester: one(semestersTable, {
		fields: [semestersTable.lastSemesterId],
		references: [semestersTable.id],
	}),
}));
