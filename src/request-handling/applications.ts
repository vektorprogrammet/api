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
			.min(1),
		lastName: z
			.string()
			.min(1),
		email: z.email({ pattern: z.regexes.html5Email }),
		gender: z
			.enum(["Female", "Male", "Other"]),
		fieldOfStudyId: serialIdParser,
		yearOfStudy: z
			.number()
			.positive()
			.int()
			.max(7),
		phonenumber: z
			.string()
			.regex(/^\d{8}$/, "Phone number must be 8 digits"),
	})
	.meta({
		id: "base-application",
		description: "The base parser for team and assistant applications, with all common attributes."
	})
	.strict();

export const teamApplicationParser = z
	.object({
		teamId: serialIdParser,
		motivationText: z
			.string()
			.max(MAX_TEXT_LENGTH),
		biography: z
			.string()
			.max(MAX_TEXT_LENGTH),
	})
	.extend(applicationParser)
	.strict();

export const assistantApplicationParser = z
	.object({})
	.extend(applicationParser)
	.strict();

export const applicationToInsertParser = applicationParser
	.extend({})
	.pipe(createInsertSchema(applicationsTable).strict().readonly());

export const teamApplicationToInsertParser = teamApplicationParser
	.extend({
		email: teamApplicationParser.shape.email.trim().toLowerCase(),
		motivationText: teamApplicationParser.shape.motivationText.trim(),
		biography: teamApplicationParser.shape.biography.trim(),
	})
	.pipe(
		createInsertSchema(teamApplicationsTable)
			.extend(createInsertSchema(applicationsTable))
			.strict()
			.readonly(),
	);

export const assistantApplicationToInsertParser = assistantApplicationParser
	.extend({})
	.pipe(
		createInsertSchema(assistantApplicationsTable)
			.extend(createInsertSchema(applicationsTable))
			.strict()
			.readonly(),
	);

export type NewApplication = z.infer<typeof applicationToInsertParser>;
export type NewTeamApplication = z.infer<typeof teamApplicationToInsertParser>;
export type NewAssistantApplication = z.infer<
	typeof assistantApplicationToInsertParser
>;
