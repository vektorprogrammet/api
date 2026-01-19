import { database } from "@/db/setup/query-postgres";
import { newDatabaseTransaction } from "./common";
import { interviewSchemasTable } from "@/db/tables/interview-schemas";
import { inArray } from "drizzle-orm";
import { ormError, OrmResult } from "../error/orm-error";
import type { InterviewSchema, InterviewSchemaKey } from "@/src/response-handling/interviews";
import type { NewInterviewSchema } from "@/src/request-handling/interviews";

export async function selectInterviewSchemaWithId(id: InterviewSchemaKey[]): Promise<OrmResult<InterviewSchema[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const result = await tx.select()
			.from(interviewSchemasTable)
			.where(inArray(interviewSchemasTable.id, id));
		if(result.length !== id.length) {
			throw ormError("Couln't find all entries");
		}

		return result;
	});
}

export async function insertInterviewSchema(interviewSchemaRequests: NewInterviewSchema[]): Promise<OrmResult<InterviewSchema[]>> {
	return await newDatabaseTransaction(database, async (tx) => {
		const result = await tx.insert(interviewSchemasTable).values(interviewSchemaRequests).returning();

		if(result.length !== interviewSchemaRequests.length) {
			throw ormError("Failed to insert all entries");
		}

		return result;
	});
}
