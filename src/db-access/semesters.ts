import { database } from "@/db/setup/query-postgres";
import { semestersTable } from "@/db/tables/semesters";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import type { OrmResult } from "../error/orm-error";
import type { DepartmentKey } from "../response-handling/departments";
import type { Semester } from "../response-handling/semesters";
import { newDatabaseTransaction } from "./common";

export const selectCurrentSemesterByDepartmentId = async (
	departmentId: DepartmentKey,
): Promise<OrmResult<Semester | null>> => {
	return await newDatabaseTransaction(database, async (tx) => {
		const today = sql`CURRENT_DATE`;
		const [recruitingSemester] = await tx
			.select()
			.from(semestersTable)
			.where(
				and(
					eq(semestersTable.departmentId, departmentId),
					lte(semestersTable.recruitmentStartDate, today),
					gte(semestersTable.recruitmentEndDate, today),
				),
			)
			.orderBy(
				desc(semestersTable.recruitmentStartDate),
				desc(semestersTable.id),
			)
			.limit(1);

		if (recruitingSemester) {
			return recruitingSemester;
		}

		const [currentSemester] = await tx
			.select()
			.from(semestersTable)
			.where(
				and(
					eq(semestersTable.departmentId, departmentId),
					lte(semestersTable.semesterStartDate, today),
					gte(semestersTable.semesterEndDate, today),
				),
			)
			.orderBy(desc(semestersTable.semesterStartDate), desc(semestersTable.id))
			.limit(1);

		return currentSemester ?? null;
	});
};
