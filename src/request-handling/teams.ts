import { expensesTable } from "@/db/tables/expenses";
import { timeStringParser } from "@/lib/time-parsers";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teamsRequestParser = z
	.object({
		departmentId: serialIdParser.describe("Id of corresponding department"),
		name: z.string().min(1).describe("Name of team"),
		email: z.string().email().describe("Email of team"),
		description: z.string().min(1).describe("Description of team"),
		shortDescription: z.string().min(1).describe("Short description of team"),
		acceptApplication: z
			.boolean()
			.describe("Whether the team is accepting applications or not"),
		active: z.boolean().describe("Whether the team is active or not"),
		deadline: timeStringParser.describe("Deadline for applying to the team"),
	})
	.strict();

export const teamsRequestToInsertParser = teamsRequestParser
	.extend({
		name: teamsRequestParser.shape.name.trim(),
		email: teamsRequestParser.shape.email.trim().toLowerCase(),
		description: teamsRequestParser.shape.description.trim(),
		shortDescription: teamsRequestParser.shape.shortDescription.trim(),
	})
	.pipe(createInsertSchema(expensesTable).strict().readonly());

export type NewTeam = z.infer<typeof teamsRequestToInsertParser>;
