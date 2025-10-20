import { integer } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { schoolsTable } from "./schools";
import { semestersTable } from "./semesters";

export const schoolSemesterTable = mainSchema.table("schoolSemesters", {
	capacity: integer("capacity").notNull(),
	schoolId: integer("schoolId")
		.notNull()
		.references(() => schoolsTable.id),
	semesterId: integer("semesterId")
		.notNull()
		.references(() => semestersTable.id),
});
