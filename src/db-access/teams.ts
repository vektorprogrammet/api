import { database } from "@/db/setup/query-postgres";
import { teamsTable } from "@/db/tables/teams";
import { type OrmResult, ormError } from "@/src/error/orm-error";
import type { Team, TeamKey } from "@/src/response-handling/teams";
import { eq, inArray } from "drizzle-orm";
import type { QueryParameters } from "../request-handling/common";
import { newDatabaseTransaction } from "./common";

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
