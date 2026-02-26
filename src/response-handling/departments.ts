import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { departmentsTable } from "@/db/tables/departments";

export const departmentsSelectSchema = createSelectSchema(departmentsTable)
    .strict()
    .readonly();

export type Department = z.infer<typeof departmentsSelectSchema>;
export type DepartmentKey = Department["id"];
