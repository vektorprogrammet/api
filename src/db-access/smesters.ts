import { database } from "@/db/setup/query-postgres";
import { semestersTable } from "@/db/tables/semesters";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import type { OrmResult } from "../error/orm-error";
import type { DepartmentKey } from "../response-handling/departments";
import type { Semester } from "../response-handling/semesters";
import { newDatabaseTransaction } from "./common";

export const selectCurrentSemesterByDepartmentId = async (
	departmentId: DepartmentKey,
): Promise<OrmResult<Semester[]>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const semester = await tx
			.select()
			.from(semestersTable)
			.where(
				and(
					eq(semestersTable.departmentId, departmentId),
					gte(semestersTable.recruitmentEndDate, sql`CURRENT_DATE`), // Is there a better solution to this?
				),
			)
			.orderBy(asc(semestersTable.recruitmentStartDate))
			.limit(1);

		return semester;
	});
};
