import { mainSchema } from "@/db/tables/schema";
import { relations } from "drizzle-orm";
import { date, integer, serial, text, time } from "drizzle-orm/pg-core";
import { semestersTable } from "./semesters";

export const meetingsTable = mainSchema.table("meetings", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	semesterId: integer("semesterId")
		.notNull()
		.references(() => semestersTable.id),
	date: date("date").notNull(),
	timeStart: time("timeStart").notNull(),
	timeEnd: text("TimeEnd").notNull(),
	room: text("room").notNull(),
});

export const meetingsRelations = relations(meetingsTable, ({ one }) => ({
	semester: one(semestersTable, {
		fields: [meetingsTable.semesterId], // FK i meetings
		references: [semestersTable.id], // PK i semesters
	}),
}));


