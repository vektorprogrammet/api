import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import {
	assistantUsersTable,
	teamUsersTable,
	usersTable,
} from "@/db/tables/users";

export const userSelectSchema = createSelectSchema(usersTable)
	.readonly();

export type User = z.infer<typeof userSelectSchema>;
export type UserKey = User["id"];

export const teamUserSelectSchema = createSelectSchema(teamUsersTable)
	.extend(createSelectSchema(usersTable))
	.readonly();
export type TeamUser = z.infer<typeof teamUserSelectSchema>;

export const assistantUserSelectSchema = createSelectSchema(assistantUsersTable)
	.extend(createSelectSchema(usersTable))
	.readonly();
export type AssistantUser = z.infer<typeof assistantUserSelectSchema>;
