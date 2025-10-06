import { serial, json } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { interviewsTable } from "./interviews";
import { relations } from "drizzle-orm";

export const interviewSchemasTable = mainSchema.table("interviewSchemas", {
    id: serial("id").primaryKey(),
    jsonSchema: json("jsonSchema").notNull(), // used to validate corresponding interviews interviewAnswers
});

export const interviewsRelations = relations(interviewsTable, ({ many }) => ({
    interviews: many(interviewsTable)
}));