import { interviewsTable } from "@/db/tables/interviews";
import { mainSchema } from "@/db/tables/schema";
import type { JSONSchemaType } from "ajv";
import { relations } from "drizzle-orm";
import { json, serial } from "drizzle-orm/pg-core";

export const interviewSchemasTable = mainSchema.table("interviewSchemas", {
	id: serial("id").primaryKey(),
	jsonSchema: json("jsonSchema").$type<JSONSchemaType<unknown>>().notNull(), // used to validate corresponding interviews interviewAnswers
});

export const interviewScemasRelations = relations(
	interviewSchemasTable,
	({ many }) => ({
		interviews: many(interviewsTable),
	}),
);
