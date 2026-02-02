diff --git a/db/tables/applications.ts b/db/tables/applications.ts
index 264868c..9eb316b 100644
--- a/db/tables/applications.ts
+++ b/db/tables/applications.ts
@@ -45,7 +45,7 @@ export const applicationsRelations = relations(
 			references: [assistantApplicationsTable.id],
 		}),
 		teamApplication: many(teamApplicationsTable),
-		interview: many(interviewsTable),
+		//interview: many(interviewsTable),
 	}),
 );
 
diff --git a/src/db-access/interviews.ts b/src/db-access/interviews.ts
index fa1e54b..f382056 100644
--- a/src/db-access/interviews.ts
+++ b/src/db-access/interviews.ts
@@ -6,6 +6,7 @@ import { ormError, OrmResult } from "../error/orm-error";
 import type { InterviewSchema, InterviewSchemaKey } from "@/src/response-handling/interviews";
 import type { NewInterview, NewInterviewSchema } from "@/src/request-handling/interviews";
 import { interviewsTable } from "@/db/tables/interviews";
+import { QueryParameters } from "../request-handling/common";
 
 export async function selectInterviewSchemaWithId(id: InterviewSchemaKey[]): Promise<OrmResult<InterviewSchema[]>> {
 	return await newDatabaseTransaction(database, async (tx) => {
@@ -20,6 +21,14 @@ export async function selectInterviewSchemaWithId(id: InterviewSchemaKey[]): Pro
 	});
 }
 
+export async function selectInterviewSchemas(list_queries: QueryParameters) {
+	return await newDatabaseTransaction(database, async (tx) => {
+		const result = await tx.select().from(interviewSchemasTable).limit(list_queries.limit).offset(list_queries.offset);
+		
+		return result;
+	})
+}
+
 export async function insertInterviewSchema(interviewSchemaRequests: NewInterviewSchema[]): Promise<OrmResult<InterviewSchema[]>> {
 	return await newDatabaseTransaction(database, async (tx) => {
 		const result = await tx.insert(interviewSchemasTable).values(interviewSchemaRequests).returning();
diff --git a/src/routers/interviews.ts b/src/routers/interviews.ts
index b8c0f0a..eaf6bb9 100644
--- a/src/routers/interviews.ts
+++ b/src/routers/interviews.ts
@@ -1,9 +1,11 @@
 import { Router } from "express";
 import { newInterviewSchemaToInsertSchema, newInterviewToInsertSchema } from "../request-handling/interviews";
-import { clientError } from "../error/http-errors";
-import { insertInterview, insertInterviewSchema, selectInterviewSchemaWithId } from "../db-access/interviews";
+import { clientError, serverError } from "../error/http-errors";
+import { insertInterview, insertInterviewSchema, selectInterviewSchemas, selectInterviewSchemaWithId } from "../db-access/interviews";
 import { validateJsonSchema } from "@/lib/json-schema";
 import { JSONSchemaType } from "ajv";
+import { serialIdParser, toListQueryParser, toSerialIdParser } from "../request-handling/common";
+import { param } from "drizzle-orm";
 
 
 const interviewsRouter = Router();
@@ -58,3 +60,51 @@ interviewsRouter.post("/schema", async (req, res, next) => {
 	}
 	res.json(databaseResult.data);
 });
+
+interviewsRouter.get("/schema/:id", async (req, res, next) => {
+	const idParameterResult = toSerialIdParser.safeParse(req.params.id);
+	if(!idParameterResult.success) {
+		next(clientError(400, "Invalid input data", idParameterResult.error));
+		return;
+	}
+	const schemaResult = await selectInterviewSchemaWithId([idParameterResult.data]);
+	if(!schemaResult.success) {
+		next(clientError(400, "Database error", schemaResult.error));
+		return;
+	}
+	res.json(schemaResult.data);
+});
+
+interviewsRouter.get("/schema", async (req, res, next) => {
+	const queryResult = toListQueryParser.safeParse(req.query);
+	if(!queryResult.success) {
+		next(clientError(400, "Invalid input data", queryResult.error));
+		return;
+	}
+	const dbResult = await selectInterviewSchemas(queryResult.data);
+	if(!dbResult.success) {
+		next(serverError(500, "Data processing error", dbResult.error));
+		return;
+	}
+	res.json(dbResult.data);
+});
+
+interviewsRouter.get("/:id", async (req, res, next) => {
+	const parameterResult = serialIdParser.safeParse(req.params.id);
+	if(!parameterResult.success) {
+		next(clientError(400, "Invalid input data", parameterResult.error));
+	}
+});
+
+
+function queryParseCall(parser, databaseCall) {
+	return (req, res, next) => {
+		const parseResult = parser.safeParse(req.query);
+		if(!parseResult.success) {
+			next(clientError(400, "Invalid input data", parseResult.error));
+			return;
+		}
+		const db
+
+	}
+}
