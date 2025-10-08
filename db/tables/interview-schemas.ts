import { relations } from "drizzle-orm";
import { json, serial } from "drizzle-orm/pg-core";
import { interviewsTable } from "./interviews";
import { mainSchema } from "./schema";

export const interviewSchemasTable = mainSchema.table("interviewSchemas", {
	id: serial("id").primaryKey(),
	jsonSchema: json("jsonSchema").notNull(), // used to validate corresponding interviews interviewAnswers
});

export const interviewsRelations = relations(interviewsTable, ({ many }) => ({
	interviews: many(interviewsTable),
}));
