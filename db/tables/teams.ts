import { teamApplicationsTable } from "@/db/tables/applications";
import { departmentsTable } from "@/db/tables/departments";
import { mainSchema } from "@/db/tables/schema";
import { relations } from "drizzle-orm";
import { boolean, serial, text, timestamp } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { teamSemesterUsersTable } from "./team-semester-user";

export const teamsTable = mainSchema.table("teams", {
	id: serial("id").primaryKey(),
	departmentId: integer("departmentId")
		.notNull()
		.references(() => departmentsTable.id),
	name: text("name").notNull().unique(),
	email: text("email").notNull().unique(),
	description: text("description").notNull(),
	shortDescription: text("shortDescription").notNull(),
	acceptApplication: boolean("acceptApplication").notNull(),
	active: boolean("active").notNull(),
	deadline: timestamp("deadline"),
});

export const teamRelations = relations(teamsTable, ({ one, many }) => ({
	department: one(departmentsTable, {
		fields: [teamsTable.departmentId],
		references: [departmentsTable.id],
	}),
	teamApplications: many(teamApplicationsTable),
	teamUsersInSemester: many(teamSemesterUsersTable),
}));
