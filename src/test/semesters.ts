import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, mock, test } from "node:test";
import { database } from "@/db/setup/query-postgres";
import { departmentsTable } from "@/db/tables/departments";
import { semestersTable } from "@/db/tables/semesters";
import { selectCurrentSemesterByDepartmentId } from "@/src/db-access/semesters";
import { sql } from "drizzle-orm";

type Fixture = {
	name: string;
	start: number;
	end: number;
	recruitmentStart: number;
	recruitmentEnd: number;
	otherDepartment?: boolean;
};

async function expectSelection(fixtures: Fixture[], expected: string | null) {
	const rollback = new Error("Rollback semester test fixtures");
	try {
		await database.transaction(async (tx) => {
			const slug = `semester-test-${randomUUID()}`;
			const [department, otherDepartment] = await tx
				.insert(departmentsTable)
				.values([
					{ city: slug, slug },
					{ city: `${slug}-other`, slug: `${slug}-other` },
				])
				.returning();

			if (fixtures.length > 0) {
				await tx.insert(semestersTable).values(
					fixtures.map((fixture) => ({
						name: fixture.name,
						departmentId: fixture.otherDepartment
							? otherDepartment.id
							: department.id,
						semesterStartDate: sql`CURRENT_DATE + ${fixture.start}::integer`,
						semesterEndDate: sql`CURRENT_DATE + ${fixture.end}::integer`,
						recruitmentStartDate: sql`CURRENT_DATE + ${fixture.recruitmentStart}::integer`,
						recruitmentEndDate: sql`CURRENT_DATE + ${fixture.recruitmentEnd}::integer`,
					})),
				);
			}

			// Keep the function under test inside this fixture transaction.
			const transactionMock = mock.method(
				database,
				"transaction",
				async (callback: Parameters<typeof database.transaction>[0]) =>
					callback(tx),
			);
			try {
				const result = await selectCurrentSemesterByDepartmentId(department.id);
				assert.ok(result.success);
				assert.equal(result.data?.name ?? null, expected);
			} finally {
				transactionMock.mock.restore();
			}
			throw rollback;
		});
	} catch (error) {
		if (error !== rollback) {
			throw error;
		}
	}
}

describe("semester selection", () => {
	test("prefers open recruitment before semester start over an ongoing semester", async () => {
		await expectSelection(
			[
				{
					name: "Ongoing",
					start: -60,
					end: 30,
					recruitmentStart: -90,
					recruitmentEnd: -61,
				},
				{
					name: "Recruiting",
					start: 30,
					end: 120,
					recruitmentStart: -5,
					recruitmentEnd: 10,
				},
			],
			"Recruiting",
		);
	});
	test("keeps the ongoing semester after its recruitment deadline", async () => {
		await expectSelection(
			[
				{
					name: "Ongoing",
					start: -60,
					end: 30,
					recruitmentStart: -90,
					recruitmentEnd: -61,
				},
			],
			"Ongoing",
		);
	});
	test("includes recruitment opening and deadline dates", async () => {
		for (const [start, end] of [
			[0, 10],
			[-10, 0],
		]) {
			await expectSelection(
				[
					{
						name: "Recruiting",
						start: 10,
						end: 120,
						recruitmentStart: start,
						recruitmentEnd: end,
					},
				],
				"Recruiting",
			);
		}
	});
	test("includes semester start and end dates", async () => {
		for (const [start, end] of [
			[0, 60],
			[-60, 0],
		]) {
			await expectSelection(
				[
					{
						name: "Ongoing",
						start,
						end,
						recruitmentStart: -90,
						recruitmentEnd: -61,
					},
				],
				"Ongoing",
			);
		}
	});
	test("does not select future recruitment, ended semesters, or another department", async () => {
		await expectSelection(
			[
				{
					name: "Future",
					start: 30,
					end: 120,
					recruitmentStart: 10,
					recruitmentEnd: 20,
				},
				{
					name: "Ended",
					start: -120,
					end: -1,
					recruitmentStart: -130,
					recruitmentEnd: -121,
				},
				{
					name: "Other department",
					start: -10,
					end: 30,
					recruitmentStart: -10,
					recruitmentEnd: 10,
					otherDepartment: true,
				},
			],
			null,
		);
	});
	test("returns null when the department has no semesters", async () => {
		await expectSelection([], null);
	});
});
