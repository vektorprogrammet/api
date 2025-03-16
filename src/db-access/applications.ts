import { database } from "@db/setup/queryPostgres";
import { applicationsTable, teamApplicationsTable } from "@db/tables/applications";
import {
	type ORMResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
	ormError,
} from "@src/error/ormError";
import type { QueryParameters } from "@src/request-handling/common";
import type { NewTeamApplication } from "@src/request-handling/applications";
import type {
	ApplicationKey,
	TeamApplication,
	TeamKey,
} from "@src/response-handling/applications";
import { eq, inArray } from "drizzle-orm";

export const selectTeamApplications = async (
	parameters: QueryParameters,
): Promise<ORMResult<TeamApplication[]>> => {
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
): Promise<ORMResult<TeamApplication[]>> => {
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
): Promise<ORMResult<TeamApplication[]>> => {
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
	teamApplication: NewTeamApplication[],
): Promise<ORMResult<TeamApplication[]>> {
	return database
		.transaction(async (tx) => {
			const newTeamApplication = await tx
				.insert(teamApplicationsTable)
				.values(teamApplication)
				.returning();
			const newTeamApplicationId = newTeamApplication.map((application) => application.id);
						const newTeamApplicationResult = await selectTeamApplicationsById(newTeamApplicationId);
						if (!newTeamApplicationResult.success) {
							throw ormError(
								"Error when inserting team users",
								newTeamApplicationResult.error,
							);
						}
			return newTeamApplicationResult.data;
		})
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
