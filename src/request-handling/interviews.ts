import { interviewsTable } from "@/db/tables/interviews";
import { turnJsonIntoZodSchema } from "@/lib/json-schema";
import {
	futureDateParser,
	timeStringParser,
	toDateParser,
} from "@/lib/time-parsers";
import { serialIdParser } from "@/src/request-handling/common";
import type { AnySchema } from "ajv";
import metaSchema from "ajv/dist/refs/json-schema-draft-07.json";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const newInterviewSchemaSchema = z.object({
	jsonSchema: turnJsonIntoZodSchema(metaSchema).transform<AnySchema>((v) => v), // If the object passed this json parser we know it is a validJsonSchema
});

export const newInterviewSchema = z.object({
	applicationId: serialIdParser,
	interviewSchemaId: serialIdParser,
	interviewAnswers: z.object({}).passthrough(), // This will be further checked after schema is gotten from database
	isCancelled: z.boolean(),
	plannedTime: timeStringParser,
});

export const newInterviewToInsertSchema = newInterviewSchema
	.extend({
		plannedTime: newInterviewSchema.shape.plannedTime
			.pipe(toDateParser)
			.pipe(futureDateParser),
	})
	.pipe(createInsertSchema(interviewsTable));

export const newInterviewSchemaToInsertSchema = newInterviewSchemaSchema.extend(
	{},
); // because of the way drizzle-zod works this pipe does wrong type inference and shouldn't be used

export type NewInterview = z.infer<typeof newInterviewToInsertSchema>;
export type NewInterviewSchema = z.infer<
	typeof newInterviewSchemaToInsertSchema
>;
