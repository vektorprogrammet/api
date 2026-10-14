import { database } from "@/db/setup/query-postgres";
import { departmentsTable } from "@/db/tables/departments";
import { teamsTable } from "@/db/tables/teams";
import { teamUsersTable } from "@/db/tables/users";
import { type OrmResult, ormError } from "@/src/error/orm-error";
import type { Team, TeamKey } from "@/src/response-handling/teams";
import { count, eq, inArray } from "drizzle-orm";
import type { QueryParameters } from "../request-handling/common";
import { newDatabaseTransaction } from "./common";

type TeamOverview = {
	team: Team;
	department: string;
	memberCount: number;
};

export async function selectTeamsById(
	teamIds: TeamKey[],
): Promise<OrmResult<Team[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const selectResult = await tx
			.select()
			.from(teamsTable)
			.where(inArray(teamsTable.id, teamIds));
		if (selectResult.length !== teamIds.length) {
			throw ormError("Couln't find all entries");
		}
		return selectResult;
	});
}

export const selectActiveTeams = async (
	parameters: QueryParameters,
): Promise<OrmResult<Team[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const teams = await tx
			.select()
			.from(teamsTable)
			.where(eq(teamsTable.active, true))
			.limit(parameters.limit)
			.offset(parameters.offset);

		return teams;
	});
};

export const selectInActiveTeams = async (
	parameters: QueryParameters,
): Promise<OrmResult<Team[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const teams = await tx
			.select()
			.from(teamsTable)
			.where(eq(teamsTable.active, false))
			.limit(parameters.limit)
			.offset(parameters.offset);

		return teams;
	});
};

export const selectActiveTeamsOverview = async (
	parameters: QueryParameters,
): Promise<OrmResult<TeamOverview[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const teams = await tx
			.select({
				team: teamsTable,
				department: departmentsTable.city,
				memberCount: count(teamUsersTable.id),
			})
			.from(teamsTable)
			.innerJoin(
				departmentsTable,
				eq(teamsTable.departmentId, departmentsTable.id),
			)
			.leftJoin(teamUsersTable, eq(teamUsersTable.teamId, teamsTable.id))
			.where(eq(teamsTable.active, true))
			.groupBy(teamsTable.id, departmentsTable.id)
			.limit(parameters.limit)
			.offset(parameters.offset);

		return teams;
	});
};
