import { relations } from "drizzle-orm";
import {
	type AnyPgColumn,
	date,
	integer,
	serial,
	text,
} from "drizzle-orm/pg-core";
import { departmentsTable } from "./departments";
import { mainSchema } from "./schema";

export const semestersTable = mainSchema.table("semesters", {
	id: serial("id").primaryKey(),
	lastSemesterId: integer("lastSemesterId").references(
		(): AnyPgColumn => semestersTable.id,
	),
	semesterStartDate: date("semesterStartDate").notNull(),
	semesterEndDate: date("semesterEndDate").notNull(),
	recruitmentStartDate: date("recruitmentStartDate").notNull(),
	recruitmentEndDate: date("recruitmentEndDate").notNull(),
	departmentId: integer("departmentId")
		.notNull()
		.references(() => departmentsTable.id),
	name: text("name").notNull(),
});

export const semestersRelations = relations(semestersTable, ({ one }) => ({
	department: one(departmentsTable, {
		fields: [semestersTable.departmentId],
		references: [departmentsTable.id],
	}),
	lastSemester: one(semestersTable, {
		fields: [semestersTable.lastSemesterId],
		references: [semestersTable.id],
	}),
	nextSemester: one(semestersTable, {
		fields: [semestersTable.id],
		references: [semestersTable.lastSemesterId],
	}),
}));
