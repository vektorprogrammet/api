import { semestersTable } from "@/db/tables/semesters";
import { timeStringParser } from "@/lib/time-parsers";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { serialIdParser } from "./common";

export const semesterRequestParser = z
	.strictObject({
		id: serialIdParser,
		lastSemesterId: serialIdParser,
		semesterStartDate: timeStringParser,
		semesterEndDate: timeStringParser,
		recruitmentStartDate: timeStringParser,
		recruitmentEndDate: timeStringParser,
		departmentId: serialIdParser,
		name: z.string(),
	})
	.meta({
		id: "semester-request"
	});

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
	.pipe(createInsertSchema(semestersTable).readonly());

export type NewSemester = z.infer<typeof semesterRequestToInsertParser>;
