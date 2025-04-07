import { database } from "@/db/setup/query-postgres";
import { applicationsTable, teamApplicationsTable } from "@/db/tables/applications";
import {
	type OrmResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
} from "@/src/error/orm-error";
import type { QueryParameters } from "@/src/request-handling/common";
import {  type NewApplication, type NewTeamApplication } from "@/src/request-handling/applications";
import type {
	ApplicationKey,
	TeamApplication,
	TeamKey,
} from "@/src/response-handling/applications";
import { eq, inArray } from "drizzle-orm";

export const selectTeamApplications = async (
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return await database
		.transaction(async (tx) => {
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
					submitDate: applicationsTable.submitDate
				})
				.from(teamApplicationsTable)
				.innerJoin(applicationsTable, eq(teamApplicationsTable.id, applicationsTable.id))
				.limit(parameters.limit)
				.offset(parameters.offset);

			return teamApplications;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
	
};


export const selectTeamApplicationsByTeamId = async (
	teamId: TeamKey[],
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return database
		.transaction(async (tx) => {
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
				submitDate: applicationsTable.submitDate
			})
			.from(teamApplicationsTable)
			.where(inArray(teamApplicationsTable.id, teamId))
			.innerJoin(applicationsTable, eq(teamApplicationsTable.id, applicationsTable.id))
			.limit(parameters.limit)
			.offset(parameters.offset);

			return selectResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
};

export const selectTeamApplicationsById = async (
	applicationIds: ApplicationKey[],
): Promise<OrmResult<TeamApplication[]>> => {
	return database
		.transaction(async (tx) => {
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
				submitDate: applicationsTable.submitDate
			})
			.from(teamApplicationsTable)
			.where(inArray(teamApplicationsTable.id, applicationIds))
			.innerJoin(applicationsTable, eq(teamApplicationsTable.id, applicationsTable.id))

			return selectResult;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
};

export async function insertTeamApplication(
	teamApplication: NewTeamApplication & NewApplication
): Promise<OrmResult<TeamApplication>> {
	return database
		.transaction(async (tx) => {
			const newApplication = await tx
				.insert(applicationsTable)
				.values({
					firstName: teamApplication.firstName,
					lastName: teamApplication.lastName,
					gender: teamApplication.gender,
					email: teamApplication.email,
					fieldOfStudyId: teamApplication.fieldOfStudyId,
					yearOfStudy: teamApplication.yearOfStudy,
					phonenumber: teamApplication.phonenumber,})
				.returning();
			const newApplicationId = newApplication[0].id;
			
			const newTeamApplicationResult = await tx
			.insert(teamApplicationsTable)
			.values({
				id:newApplicationId,
				teamId: teamApplication.teamId,
				motivationText: teamApplication.motivationText,
				biography: teamApplication.biography
			}).returning();

			
			return {
				...newApplication[0],
				...newTeamApplicationResult[0]
			}
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
