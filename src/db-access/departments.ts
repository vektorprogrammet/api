import { database } from "@/db/setup/query-postgres";
import { departmentsTable } from "@/db/tables/departments";
import type { OrmResult } from "../error/orm-error";
import type { Department } from "../response-handling/departments";
import { newDatabaseTransaction } from "./common";

export const selectAllDepartments = async (): Promise<
	OrmResult<Department[]>
> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const departments = await tx.select().from(departmentsTable);

		return departments;
	});
};
