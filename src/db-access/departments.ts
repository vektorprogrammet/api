import { database } from "@/db/setup/query-postgres";
import { OrmResult } from "../error/orm-error";
import { QueryParameters } from "../request-handling/common";
import { Department } from "../response-handling/departments";
import { newDatabaseTransaction } from "./common";
import { departmentsTable } from "@/db/tables/departments";

export const selectAllDepartments = async (): Promise<OrmResult<Department[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const departments = await tx
			.select()
			.from(departmentsTable);

		return departments;
	});
};
