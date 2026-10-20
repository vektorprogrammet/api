import { mainSchema } from "@/db/tables/schema";
import { serial, text } from "drizzle-orm/pg-core";

export const teamUserRolesTable = mainSchema.table("teamUserRoles", {
	id: serial("id").primaryKey(),
	name: text("name").notNull().unique(),
});
