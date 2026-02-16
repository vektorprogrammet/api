import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import {
	applicationsTable,
	assistantApplicationsTable,
	teamApplicationsTable,
} from "@/db/tables/applications";

export const applicationSelectSchema = createSelectSchema(applicationsTable)
	.strict()
	.readonly();

export type Application = z.infer<typeof applicationSelectSchema>;
export type ApplicationKey = Application["id"];

export const teamApplicationSelectSchema = createSelectSchema(
	teamApplicationsTable,
)
	.merge(createSelectSchema(applicationsTable))
	.strict()
	.readonly();

export type TeamApplication = z.infer<typeof teamApplicationSelectSchema>;
export type TeamApplicationKey = {
	id: TeamApplication["id"];
	applicationParentId: TeamApplication["applicationParentId"];
};
export type TeamKey = TeamApplication["teamId"];

export const assistantApplicationSelectSchema = createSelectSchema(
	assistantApplicationsTable,
)
	.merge(createSelectSchema(applicationsTable))
	.strict()
	.readonly();
export type AssistantApplication = z.infer<
	typeof assistantApplicationSelectSchema
>;
