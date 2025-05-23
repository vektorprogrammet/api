import {
	type OrmResult,
	handleDatabaseFullfillment,
	handleDatabaseRejection,
} from "@/src/error/orm-error";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type {
	NodePgDatabase,
	NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";

export async function newDatabaseTransaction<R>(
	database: NodePgDatabase,
	transactionQuery: (
		tx: PgTransaction<
			NodePgQueryResultHKT,
			Record<string, never>,
			ExtractTablesWithRelations<Record<string, never>>
		>,
	) => Promise<R>,
): Promise<OrmResult<R>> {
	return await database
		.transaction(transactionQuery)
		.then(handleDatabaseFullfillment, handleDatabaseRejection);
}
