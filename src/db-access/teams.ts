import { database } from "@/db/setup/query-postgres";
import { departmentsTable } from "@/db/tables/departments";
import { teamUserRolesTable } from "@/db/tables/team-roles";
import { teamsTable } from "@/db/tables/teams";
import { teamUsersTable, usersTable } from "@/db/tables/users";
import { type OrmResult, ormError } from "@/src/error/orm-error";
import type { Team, TeamKey } from "@/src/response-handling/teams";
import { and, count, eq, inArray, or, sql } from "drizzle-orm";
import type { QueryParameters } from "../request-handling/common";
import { newDatabaseTransaction } from "./common";
import { teamUserRolesTable } from "@/db/tables/team-roles";

type TeamOverview = {
	team: Team;
	departmentCity: string;
	memberCount: number;
};

type TeamWithMembers = {
	team: Team;
	departmentCity: string;
	members: {
		id: number;
		firstName: string;
		lastName: string;
		profilePictureUrl: string | null;
		teamUserRoleId: number;
		teamUserRoleName: string;
		isTeamLeader: boolean;
	}[];
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

export const selectActiveTeamsOverview = async (): Promise<
	OrmResult<TeamOverview[]>
> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const teams = await tx
			.select({
				team: teamsTable,
				departmentCity: departmentsTable.city,
				memberCount: count(teamUsersTable.userId),
			})
			.from(teamsTable)
			.innerJoin(
				departmentsTable,
				eq(teamsTable.departmentId, departmentsTable.id),
			)
			.leftJoin(teamUsersTable, eq(teamUsersTable.teamId, teamsTable.id))
			.where(eq(teamsTable.active, true))
			.groupBy(teamsTable.id, departmentsTable.id)
			.orderBy(teamsTable.id);

		return teams;
	});
};

export const selectActiveTeamAndMembersByDepartmentAndTeam = async (
	department: string,
	team: string,
): Promise<OrmResult<TeamWithMembers>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const matchingTeams = await tx
			.select({
				team: teamsTable,
				departmentCity: departmentsTable.city,
			})
			.from(teamsTable)
			.innerJoin(
				departmentsTable,
				eq(teamsTable.departmentId, departmentsTable.id),
			)
			.where(
				or(
					and(
						sql`lower(${departmentsTable.slug}) = ${department.toLowerCase()}`,
						sql`lower(${teamsTable.slug}) = ${team.toLowerCase()}`,
						eq(teamsTable.active, true),
					),
					and(
						sql`lower(${departmentsTable.city}) = ${department.toLowerCase()}`,
						sql`lower(${teamsTable.name}) = ${team.toLowerCase()}`,
						eq(teamsTable.active, true),
					),
				),
			)
			.limit(2);

		if (matchingTeams.length !== 1) {
			throw ormError("Couln't find all entries");
		}
		const [teamDetails] = matchingTeams;

		const members = await tx
			.select({
				id: usersTable.id,
				teamId: teamUsersTable.teamId,
				firstName: usersTable.firstName,
				lastName: usersTable.lastName,
				profilePictureUrl: usersTable.profilePictureUrl,
				teamUserRoleId: teamUsersTable.teamUserRoleId,
				teamUserRoleName: teamUserRolesTable.name,
				isTeamLeader: teamUsersTable.isTeamLeader,
			})
			.from(teamUsersTable)
			.innerJoin(usersTable, eq(teamUsersTable.userId, usersTable.id))
			.innerJoin(teamUserRolesTable, eq(teamUsersTable.teamUserRoleId, teamUserRolesTable.id))
			.where(eq(teamUsersTable.teamId, teamDetails.team.id));

		return { ...teamDetails, members };
	});
};

export const selectHovedstyretContacts = async () => {
	return await newDatabaseTransaction(database, async (tx) => {
		return await tx
			.select({
				firstName: usersTable.firstName,
				lastName: usersTable.lastName,
				mail: usersTable.companyEmail,
				title: teamUserRolesTable.name,
			})
			.from(teamUsersTable)
			.innerJoin(
				usersTable,
				eq(teamUsersTable.userId, usersTable.id),
			)
			.innerJoin(
				teamsTable,
				eq(teamUsersTable.teamId, teamsTable.id),
			)
			.innerJoin(
				teamUserRolesTable,
				eq(teamUsersTable.teamUserRoleId, teamUserRolesTable.id),
			)
			.where(
				and(
					eq(teamsTable.name, "Hovedstyret"),
					eq(teamsTable.active, true),
				),
			)
			.orderBy(
				sql`CASE
          WHEN lower(${teamUserRolesTable.name}) = 'leder' THEN 0
          WHEN lower(${teamUserRolesTable.name}) = 'nestleder' THEN 1
          ELSE 2
        END`,
				usersTable.firstName,
				usersTable.lastName,
			);
	});
};
