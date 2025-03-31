import { relations } from "drizzle-orm";
import { boolean, integer, serial, text } from "drizzle-orm/pg-core";
import { departmentsTable } from "./departments";
import { mainSchema } from "./schema";

export const schoolsTable = mainSchema.table("schools", {
	id: serial("id").primaryKey(),
	departmentId: integer("departmentId").references(() => departmentsTable.id),
	name: text("name").notNull(),
	contactPersonName: text("contactPersonName").notNull(),
	contactPersonPhoneNumber: text("contactPersonPhoneNumber").notNull(),
	contactPersonEmail: text("contactpersonEmail").notNull(),
	isInternational: boolean("isInternational").notNull(),
});

export const schoolsRelations = relations(schoolsTable, ({ one }) => ({
	department: one(departmentsTable, {
		fields: [schoolsTable.departmentId],
		references: [departmentsTable.id],
	}),
}));
