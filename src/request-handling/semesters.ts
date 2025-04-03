import { semestersTable } from "@/db/tables/semesters";
import { timeStringParser } from "@/lib/time-parsers";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { serialIdParser } from "./common";

export const semesterRequestParser = z
	.object({
		id: serialIdParser.describe("Id of semester"),
		lastSemesterId: serialIdParser.describe("Id of last semester"),
		semesterStartDate: timeStringParser.describe("Date of semester start"),
		semesterEndDate: timeStringParser.describe("Date of semester end"),
		recruitmentStartDate: timeStringParser.describe(
			"Date of recruitment period start",
		),
		recruitmentEndDate: timeStringParser.describe(
			"Date of recruitment period end",
		),
		departmentId: serialIdParser.describe("Id of corresponding department"),
		name: z.string().describe("Name of semester"),
	})
	.strict();

export const semesterRequestToInsertParser = semesterRequestParser
	.extend({
		name: semesterRequestParser.shape.name.trim(),
		semesterStartDate: semesterRequestParser.shape.semesterStartDate.pipe(
			z.coerce.date(),
		),
		semesterEndDate: semesterRequestParser.shape.semesterEndDate.pipe(
			z.coerce.date(),
		),
		recruitmentStartDate: semesterRequestParser.shape.recruitmentStartDate.pipe(
			z.coerce.date(),
		),
		recruitmentEndDate: semesterRequestParser.shape.recruitmentEndDate.pipe(
			z.coerce.date(),
		),
	})
	.pipe(createInsertSchema(semestersTable).strict().readonly());

export type NewSemester = z.infer<typeof semesterRequestToInsertParser>;
