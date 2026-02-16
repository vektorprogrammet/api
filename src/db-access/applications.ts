import { database } from "@/db/setup/query-postgres";
import {
	applicationsTable,
	teamApplicationsTable,
} from "@/db/tables/applications";
import { type OrmResult, ormError } from "@/src/error/orm-error";
import type {
	NewApplication,
	NewTeamApplication,
	NewTeamInterestApplication,
} from "@/src/request-handling/applications";
import type { QueryParameters } from "@/src/request-handling/common";
import type {
	ApplicationKey,
	TeamApplication,
	TeamKey,
} from "@/src/response-handling/applications";
import { and, eq, inArray } from "drizzle-orm";
import { newDatabaseTransaction } from "./common";
import { SemesterKey } from "../response-handling/semesters";

export const selectTeamApplications = async (
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const teamApplications = await tx
			.select({
				id: applicationsTable.id,
				applicationParentId: teamApplicationsTable.applicationParentId,
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
				teamInterest: teamApplicationsTable.teamInterest,
				semester: applicationsTable.semester,
				submitDate: applicationsTable.submitDate,
			})
			.from(teamApplicationsTable)
			.innerJoin(
				applicationsTable,
				eq(teamApplicationsTable.applicationParentId, applicationsTable.id),
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
				applicationParentId: teamApplicationsTable.applicationParentId,
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
				teamInterest: teamApplicationsTable.teamInterest,
				semester: applicationsTable.semester,
				submitDate: applicationsTable.submitDate,
			})
			.from(teamApplicationsTable)
			.where(inArray(teamApplicationsTable.id, teamId))
			.innerJoin(
				applicationsTable,
				eq(teamApplicationsTable.applicationParentId, applicationsTable.id),
			)
			.limit(parameters.limit)
			.offset(parameters.offset);

		return selectResult;
	});
};

export const selectTeamApplicationsById = async (
	applicationIds: ApplicationKey[],
	teamApplicationIds: number[],
): Promise<OrmResult<TeamApplication[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const selectResult = await tx
			.select({
				id: teamApplicationsTable.id,
				applicationParentId: teamApplicationsTable.applicationParentId,
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
				teamInterest: teamApplicationsTable.teamInterest,
				semester: applicationsTable.semester,
				submitDate: applicationsTable.submitDate,
			})
			.from(teamApplicationsTable)
			.where(
				and(
					inArray(teamApplicationsTable.applicationParentId, applicationIds),
					inArray(teamApplicationsTable.id, teamApplicationIds),
				),
			)
			.innerJoin(
				applicationsTable,
				eq(teamApplicationsTable.applicationParentId, applicationsTable.id),
			);

		return selectResult;
	});
};

export const selectTeamApplicationsBySemester = async (
	semesterId: SemesterKey[],
	parameters: QueryParameters,
): Promise<OrmResult<TeamApplication[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const selectResult = await tx
			.select({
				id: teamApplicationsTable.id,
				applicationParentId: teamApplicationsTable.applicationParentId,
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
				teamInterest: teamApplicationsTable.teamInterest,
				semester: applicationsTable.semester,
				submitDate: applicationsTable.submitDate,
			})
			.from(teamApplicationsTable)
			.where(
				inArray(applicationsTable.semester, semesterId),
			)
			.innerJoin(
				applicationsTable,
				eq(teamApplicationsTable.applicationParentId, applicationsTable.id),
			)
			.limit(parameters.limit)
			.offset(parameters.offset);

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
				semester: teamApplication.semester,
			})
			.returning();
		const newApplicationId = newApplication[0].id;

		const newTeamApplicationResult = await tx
			.insert(teamApplicationsTable)
			.values({
				applicationParentId: newApplicationId,
				teamId: teamApplication.teamId,
				motivationText: teamApplication.motivationText,
				biography: teamApplication.biography,
				teamInterest: teamApplication.teamInterest,
			})
			.returning();

		return {
			...newApplication[0],
			...newTeamApplicationResult[0],
		};
	});
}

export async function createTeamApplicationFromAssistantApplication(
	teamInterestApplication: NewTeamInterestApplication,
): Promise<OrmResult<TeamApplication[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const newTeamApplicationResult = await tx
			.insert(teamApplicationsTable)
			.values({
				applicationParentId: teamInterestApplication.applicationParentId,
				teamId: teamInterestApplication.teamId,
				motivationText: teamInterestApplication.motivationText,
				biography: teamInterestApplication.biography,
				teamInterest: true,
			})
			.returning();

		const teamApplicationResult = await selectTeamApplicationsById(
			[teamInterestApplication.applicationParentId],
			[newTeamApplicationResult[0].id],
		);
		if (!teamApplicationResult.success) {
			throw ormError("Transaction failed", teamApplicationResult.error);
		}

		return teamApplicationResult.data;
	});
}
