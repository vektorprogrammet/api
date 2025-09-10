import { schoolsTable } from "@/db/tables/schools";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const schoolsSelectSchema = createSelectSchema(schoolsTable)
	.readonly();

export type School = z.infer<typeof schoolsSelectSchema>;
export type SchoolsKey = School["id"];
