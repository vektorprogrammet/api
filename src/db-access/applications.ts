import { database } from "@/db/setup/query-postgres";
import {
	applicationsTable,
	teamApplicationsTable,
} from "@/db/tables/applications";
import type { OrmResult } from "@/src/error/orm-error";
import type {
	NewApplication,
	NewTeamApplication,
} from "@/src/request-handling/applications";
import type { QueryParameters } from "@/src/request-handling/common";
import type {
	ApplicationKey,
	TeamApplication,
	TeamKey,
} from "@/src/response-handling/applications";
import { eq, inArray } from "drizzle-orm";
import { newDatabaseTransaction } from "./common";

export const selectTeamApplications = async (
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const teamApplications = await tx
			.select({
				id: applicationsTable.id,
				teamId: teamApplicationsTable.teamId,
				firstName: applicationsTable.firstName,
				lastName: applicationsTable.lastName,
				gender: applicationsTable.gender,
				email: applicationsTable.email,
				fieldOfStudyId: applicationsTable.fieldOfStudyId,
				yearOfStudy: applicationsTable.yearOfStudy,
				phonenumber: applicationsTable.phonenumber,
				motivationText: teamApplicationsTable.motivationText,
				biography: teamApplicationsTable.biography,
				submitDate: applicationsTable.submitDate,
			})
			.from(teamApplicationsTable)
			.innerJoin(
				applicationsTable,
				eq(teamApplicationsTable.id, applicationsTable.id),
			)
			.limit(parameters.limit)
			.offset(parameters.offset);

		return teamApplications;
	});
};

export const selectTeamApplicationsByTeamId = async (
	teamId: TeamKey[],
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const selectResult = await tx
			.select({
				id: applicationsTable.id,
				teamId: teamApplicationsTable.teamId,
				firstName: applicationsTable.firstName,
				lastName: applicationsTable.lastName,
				gender: applicationsTable.gender,
				email: applicationsTable.email,
				fieldOfStudyId: applicationsTable.fieldOfStudyId,
				yearOfStudy: applicationsTable.yearOfStudy,
				phonenumber: applicationsTable.phonenumber,
				motivationText: teamApplicationsTable.motivationText,
				biography: teamApplicationsTable.biography,
				submitDate: applicationsTable.submitDate,
			})
			.from(teamApplicationsTable)
			.where(inArray(teamApplicationsTable.id, teamId))
			.innerJoin(
				applicationsTable,
				eq(teamApplicationsTable.id, applicationsTable.id),
			)
			.limit(parameters.limit)
			.offset(parameters.offset);

		return selectResult;
	});
};

export const selectTeamApplicationsById = async (
	applicationIds: ApplicationKey[],
): Promise<OrmResult<TeamApplication[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const selectResult = await tx
			.select({
				id: applicationsTable.id,
				teamId: teamApplicationsTable.teamId,
				firstName: applicationsTable.firstName,
				lastName: applicationsTable.lastName,
				gender: applicationsTable.gender,
				email: applicationsTable.email,
				fieldOfStudyId: applicationsTable.fieldOfStudyId,
				yearOfStudy: applicationsTable.yearOfStudy,
				phonenumber: applicationsTable.phonenumber,
				motivationText: teamApplicationsTable.motivationText,
				biography: teamApplicationsTable.biography,
				submitDate: applicationsTable.submitDate,
			})
			.from(teamApplicationsTable)
			.where(inArray(teamApplicationsTable.id, applicationIds))
			.innerJoin(
				applicationsTable,
				eq(teamApplicationsTable.id, applicationsTable.id),
			);

		return selectResult;
	});
};

export async function insertTeamApplication(
	teamApplication: NewTeamApplication & NewApplication,
): Promise<OrmResult<TeamApplication>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const newApplication = await tx
			.insert(applicationsTable)
			.values({
				firstName: teamApplication.firstName,
				lastName: teamApplication.lastName,
				gender: teamApplication.gender,
				email: teamApplication.email,
				fieldOfStudyId: teamApplication.fieldOfStudyId,
				yearOfStudy: teamApplication.yearOfStudy,
				phonenumber: teamApplication.phonenumber,
			})
			.returning();
		const newApplicationId = newApplication[0].id;

		const newTeamApplicationResult = await tx
			.insert(teamApplicationsTable)
			.values({
				id: newApplicationId,
				teamId: teamApplication.teamId,
				motivationText: teamApplication.motivationText,
				biography: teamApplication.biography,
			})
			.returning();

		return {
			...newApplication[0],
			...newTeamApplicationResult[0],
		};
	});
}
