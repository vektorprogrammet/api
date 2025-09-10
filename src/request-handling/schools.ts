import { schoolsTable } from "@/db/tables/schools";
import { phoneNumberParser } from "@/lib/lib";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { serialIdParser } from "./common";

export const schoolRequestParser = z
	.strictObject({
		id: serialIdParser.,
		departmentId: serialIdParser,
		name: z.string(),
		contactPersonName: z.string(),
		contactPersonPhoneNumber: phoneNumberParser,
		contactPersonEmail: z.string(),
		isInternational: z
			.boolean(),
	})
	.meta({
		id: "school-request"
	});

export const schoolRequestToInsertParser = schoolRequestParser
	.extend({
		name: schoolRequestParser.shape.name.trim(),
		contactPersonName: schoolRequestParser.shape.contactPersonName.trim(),
		contactPersonEmail: schoolRequestParser.shape.contactPersonEmail.trim(),
	})
	.pipe(createInsertSchema(schoolsTable).readonly());

export type NewSchool = z.infer<typeof schoolRequestToInsertParser>;
