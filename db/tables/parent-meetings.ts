import { relations } from "drizzle-orm";
import { integer, interval, serial, text, timestamp } from "drizzle-orm/pg-core";
import { mainSchema } from "./schema";
import { semestersTable } from "./semesters";
import { teamUsersTable } from "./users";

export const parentMeetingsTable = mainSchema.table("parentMeetings", {
	id: serial("id").primaryKey(),
	dateTime: timestamp("dateTime").notNull(),
	duration: interval("duration").notNull(),
	place: text("place").notNull(),
	semesterId: integer("semesterId")
		.notNull()
		.references(() => semestersTable.id),
	// id of the team user responsible for organizing and conducting the parent meeting
	responsibleUserId: integer("responsibleUserId")
		.notNull()
		.references(() => teamUsersTable.id),
});

export const parentMeetingsRelations = relations(
	parentMeetingsTable,
	({ one }) => ({
		semester: one(semestersTable, {
			fields: [parentMeetingsTable.semesterId],
			references: [semestersTable.id],
		}),
		teamUser: one(teamUsersTable, {
			fields: [parentMeetingsTable.responsibleUserId],
			references: [teamUsersTable.id],
		}),
	}),
);
