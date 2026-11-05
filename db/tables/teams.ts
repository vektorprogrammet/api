import { teamApplicationsTable } from "@/db/tables/applications";
import { departmentsTable } from "@/db/tables/departments";
import { mainSchema } from "@/db/tables/schema";
import type { TeamDescription } from "@/src/lib/team-description";
import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	jsonb,
	serial,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";
import { teamSemesterUsersTable } from "./team-semester-user";

export const teamsTable = mainSchema.table(
	"teams",
	{
		id: serial("id").primaryKey(),
		departmentId: integer("departmentId")
			.notNull()
			.references(() => departmentsTable.id),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		email: text("email").notNull().unique(),
		description: jsonb("description").$type<TeamDescription>().notNull(),
		shortDescription: text("shortDescription").notNull(),
		acceptApplication: boolean("acceptApplication").notNull(),
		active: boolean("active").notNull(),
		deadline: timestamp("deadline"),
	},
	(table) => ({
		departmentIdNameUnique: unique("teams_departmentId_name_unique").on(
			table.departmentId,
			table.name,
		),
	}),
);

export const teamRelations = relations(teamsTable, ({ one, many }) => ({
	department: one(departmentsTable, {
		fields: [teamsTable.departmentId],
		references: [departmentsTable.id],
	}),
	teamApplications: many(teamApplicationsTable),
	teamUsersInSemester: many(teamSemesterUsersTable),
}));
