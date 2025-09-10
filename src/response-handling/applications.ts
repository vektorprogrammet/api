import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import {
	applicationsTable,
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
	.extend(createSelectSchema(applicationsTable))
	.strict()
	.readonly();

export type TeamApplication = z.infer<typeof teamApplicationSelectSchema>;
export type TeamApplicationKey = TeamApplication["id"];
export type TeamKey = TeamApplication["teamId"];
