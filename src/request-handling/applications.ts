import {
	applicationsTable,
	assistantApplicationsTable,
	teamApplicationsTable,
} from "@/db/tables/applications";
import { MAX_TEXT_LENGTH } from "@/lib/global-variables";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applicationParser = z
	.object({
		firstName: z
			.string()
			.min(1)
			.describe("First name of user applying for a team"),
		lastName: z
			.string()
			.min(1)
			.describe("Last name of user applying for a team"),
		email: z.string().email().describe("Email of user applying for a team"),
		gender: z
			.enum(["Female", "Male", "Other"])
			.describe("The gender of the user applying for a team"),
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
		phonenumber: z
			.string()
			.regex(/^\d{8}$/, "Phone number must be 8 digits")
			.describe("The phonenumber of the user applying for a team"),
	})
	.strict();

export const teamApplicationParser = z
	.object({
		teamId: serialIdParser.describe("Id of team applied for"),
		motivationText: z
			.string()
			.max(MAX_TEXT_LENGTH)
			.describe("The motivation text of user applying for a team"),
		biography: z
			.string()
			.max(MAX_TEXT_LENGTH)
			.describe("The biography of the user applying for a team"),
	})
	.merge(applicationParser)
	.strict();

export const assistantApplicationParser = z
	.object({})
	.merge(applicationParser)
	.strict();

export const applicationToInsertParser = applicationParser
	.extend({})
	.pipe(createInsertSchema(applicationsTable).strict().readonly());

export const teamApplicationToInsertParser = teamApplicationParser
	.extend(
		{
			email: teamApplicationParser.shape.email.trim().toLowerCase(),
			motivationText: teamApplicationParser.shape.motivationText.trim(),
			biography: teamApplicationParser.shape.biography.trim(),
		},
	)
	.pipe(
		createInsertSchema(teamApplicationsTable)
			.merge(createInsertSchema(applicationsTable))
			.strict()
			.readonly(),
	);

export const assistantApplicationToInsertParser = assistantApplicationParser
	.extend({})
	.pipe(
		createInsertSchema(assistantApplicationsTable)
			.merge(createInsertSchema(applicationsTable))
			.strict()
			.readonly(),
	);

export type NewApplication = z.infer<typeof applicationToInsertParser>;
export type NewTeamApplication = z.infer<typeof teamApplicationToInsertParser>;
export type NewAssistantApplication = z.infer<
	typeof assistantApplicationToInsertParser
>;
