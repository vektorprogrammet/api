import { teamsTable } from "@/db/tables/teams";
import { timeStringParser } from "@/lib/time-parsers";
import { parseWithSchema } from "@/lib/zod";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const teamInsertSchema = createInsertSchema(teamsTable).strict().readonly();

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
	.transform(parseWithSchema(teamInsertSchema));

export type NewTeam = z.infer<typeof teamsRequestToInsertParser>;
