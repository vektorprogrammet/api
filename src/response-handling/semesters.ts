import { semestersTable } from "@/db/tables/semesters";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const semestersSelectSchema = createSelectSchema(semestersTable)
	.strict()
	.readonly();

export type Semester = z.infer<typeof semestersSelectSchema>;
export type SemesterKey = Semester["id"];
