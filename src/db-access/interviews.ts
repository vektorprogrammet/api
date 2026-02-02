import { database } from "@/db/setup/query-postgres";
import { interviewSchemasTable } from "@/db/tables/interview-schemas";
import { interviewsTable } from "@/db/tables/interviews";
import type {
	NewInterview,
	NewInterviewSchema,
} from "@/src/request-handling/interviews";
import type {
	InterviewSchema,
	InterviewSchemaKey,
} from "@/src/response-handling/interviews";
import { inArray } from "drizzle-orm";
import { type OrmResult, ormError } from "../error/orm-error";
import type { QueryParameters } from "../request-handling/common";
import { newDatabaseTransaction } from "./common";

export async function selectInterviewSchemaWithId(
	id: InterviewSchemaKey[],
): Promise<OrmResult<InterviewSchema[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const result = await tx
			.select()
			.from(interviewSchemasTable)
			.where(inArray(interviewSchemasTable.id, id));
		if (result.length !== id.length) {
			throw ormError("Couln't find all entries");
		}

		return result;
	});
}

export async function selectInterviewSchemas(listQueries: QueryParameters) {
	return await newDatabaseTransaction(database, async (tx) => {
		const result = await tx
			.select()
			.from(interviewSchemasTable)
			.limit(listQueries.limit)
			.offset(listQueries.offset);

		return result;
	});
}

export async function insertInterviewSchema(
	interviewSchemaRequests: NewInterviewSchema[],
): Promise<OrmResult<InterviewSchema[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const result = await tx
			.insert(interviewSchemasTable)
			.values(interviewSchemaRequests)
			.returning();

		if (result.length !== interviewSchemaRequests.length) {
			throw ormError("Failed to insert all entries");
		}

		return result;
	});
}

export async function insertInterview(interviewRequests: NewInterview[]) {
	return await newDatabaseTransaction(database, async (tx) => {
		const result = await tx
			.insert(interviewsTable)
			.values(interviewRequests)
			.returning();

		if (result.length !== interviewRequests.length) {
			throw ormError("Failed to insert all entries");
		}
		return result;
	});
}
