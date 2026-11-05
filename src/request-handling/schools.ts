import { schoolsTable } from "@/db/tables/schools";
import { parseWithSchema, phoneNumberParser } from "@/lib/zod";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { serialIdParser } from "./common";

const schoolInsertSchema = createInsertSchema(schoolsTable).strict().readonly();

export const schoolRequestParser = z
	.object({
		id: serialIdParser.describe("Id of school"),
		departmentId: serialIdParser.describe("Id of corresponding department"),
		name: z.string().describe("Name of school"),
		contactPersonName: z.string().describe("Name of contact person on school"),
		contactPersonPhoneNumber: phoneNumberParser.describe(
			"Phone number of contact person",
		),
		contactPersonEmail: z.string().describe("Email of contact person"),
		isInternational: z
			.boolean()
			.describe("Whether the school is international or not"),
	})
	.strict();

export const schoolRequestToInsertParser = schoolRequestParser
	.extend({
		name: schoolRequestParser.shape.name.trim(),
		contactPersonName: schoolRequestParser.shape.contactPersonName.trim(),
		contactPersonEmail: schoolRequestParser.shape.contactPersonEmail.trim(),
	})
	.transform(parseWithSchema(schoolInsertSchema));

export type NewSchool = z.infer<typeof schoolRequestToInsertParser>;
