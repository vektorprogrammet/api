import { teamApplicationsTable } from "@/db/tables/team-applications";
import { MAX_TEXT_LENGTH } from "@/lib/global-variables";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamApplicationParser = z.object({
	teamId: serialIdParser.describe("Id of team applied for"),
	name: z.string().min(1).describe("Name of user applying for a team"),
	email: z.string().email().describe("Email of user applying for a team"),
	motivationText: z
		.string()
		.max(MAX_TEXT_LENGTH)
		.describe("The motivation text of user applying for a team"),
	fieldOfStudyId: serialIdParser.describe(
		"Studyfield of user applying for a team",
	),
	yearOfStudy: z
		.number()
		.finite()
		.safe()
		.positive()
		.int()
		.max(7)
		.describe("The year of study the user applying for a team is in"),
	biography: z
		.string()
		.max(MAX_TEXT_LENGTH)
		.describe("The biography of the user applying for a team"),
	phonenumber: z
		.string()
		.regex(/^\d{8}$/, "Phone number must be 8 digits")
		.describe("The phonenumber of the user applying for a team"),
});

export const teamApplicationToInsertParser = teamApplicationParser
	.extend({
		email: teamApplicationParser.shape.email.trim().toLowerCase(),
		motivationText: teamApplicationParser.shape.motivationText.trim(),
		biography: teamApplicationParser.shape.biography.trim(),
	})
	.pipe(createInsertSchema(teamApplicationsTable).strict().readonly());

export type NewTeamApplication = z.infer<typeof teamApplicationToInsertParser>;
