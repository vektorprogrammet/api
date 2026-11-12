import { departmentsTable } from "@/db/tables/departments";
import { parseWithSchema } from "@/lib/zod";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const departmentInsertSchema = createInsertSchema(departmentsTable)
	.strict()
	.readonly();

export const departmentsRequestParser = z
	.object({
		city: z.string().min(1).describe("City of the region"),
		slug: z.string().min(1).describe("Url-friendly spelling of city"),
	})
	.strict();

export const departmentsRequestToInsertParser = departmentsRequestParser
	.extend({
		city: departmentsRequestParser.shape.city.trim(),
		slug: departmentsRequestParser.shape.slug.trim(),
	})
	.transform(parseWithSchema(departmentInsertSchema));

export type NewDepartment = z.infer<typeof departmentsRequestToInsertParser>;
