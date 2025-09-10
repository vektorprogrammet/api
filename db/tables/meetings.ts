import { mainSchema } from "@/db/tables/schema";
import { usersTable } from "@/db/tables/users";
import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    numeric,
    serial,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { semestersTable } from "./semesters";

export const meetingsTable = mainSchema.table("meetings", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    semesterId: text("semesterId")
        .notNull()
        .references(() => semestersTable.id),
    date: text("date").notNull(),
    timestart: text("TimeStart").notNull(),
    timeEnd: text("TimeEnd").notNull(),
    room: text("room").notNull()
});

export const meetingsRelations = relations(meetingsTable, ({ one }) => ({
  semester: one(semestersTable, {
    fields: [meetingsTable.semesterId],   // FK i meetings
    references: [semestersTable.id],      // PK i semesters
  }),
}));

export const meetings = relations(meetingsTable, () => ({}));

