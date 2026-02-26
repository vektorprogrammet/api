import { departmentsTable } from "@/db/tables/departments";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const departmentRequestParser = z
    .object({
        id: serialIdParser.describe("Id of department"),
        city: z
            .enum(["Trondheim", "Ås", "Bergen", "Tromsø"])
			.describe("The city of a department"),
        
    })
    .strict();
export const departmentRequestToInsertParser = departmentRequestParser
    .extend({})
    .pipe(createInsertSchema(departmentsTable).strict().readonly());

export type NewDepartment = z.infer<typeof departmentRequestToInsertParser>;
