import { departmentsTable } from "@/db/tables/departments";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const departmentsSelectSchema = createSelectSchema(departmentsTable)
	.strict()
	.readonly()

export type Department = z.infer<typeof departmentsSelectSchema>;
export type DepartmentKey = Department["id"];
