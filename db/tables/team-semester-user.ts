import { relations } from "drizzle-orm";
import { foreignKey, integer } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { semestersTable } from "./semesters";
import { teamsTable } from "./teams";
import { teamUsersTable } from "./users";

export const teamSemesterUsersTable = mainSchema.table(
	"teamSemesterUser",
	{
		teamId: integer("teamId").references(() => teamsTable.id),
		semesterId: integer("semesterId").references(() => semestersTable.id),
		teamUserId: integer("teamUserId"),
	},
	(table) => ({
		teamUserForeignKey: foreignKey({
			columns: [table.teamUserId, table.teamId],
			foreignColumns: [teamUsersTable.userId, teamUsersTable.teamId],
		}),
	}),
);

export const teamSemesterUsersRelations = relations(
	teamSemesterUsersTable,
	({ one }) => ({
		team: one(teamsTable, {
			fields: [teamSemesterUsersTable.teamId],
			references: [teamsTable.id],
		}),
		semester: one(semestersTable, {
			fields: [teamSemesterUsersTable.semesterId],
			references: [semestersTable.id],
		}),
		teamUser: one(teamUsersTable, {
			fields: [
				teamSemesterUsersTable.teamUserId,
				teamSemesterUsersTable.teamId,
			],
			references: [teamUsersTable.userId, teamUsersTable.teamId],
		}),
	}),
);
