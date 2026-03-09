import { interviewSchemasTable } from "@/db/tables/interview-schemas";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

const interviewSchemaSchema = createSelectSchema(interviewSchemasTable)
	.strict()
	.readonly();

export type InterviewSchema = z.infer<typeof interviewSchemaSchema>;
export type InterviewSchemaKey = InterviewSchema["id"];
