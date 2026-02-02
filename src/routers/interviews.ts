import { Router } from "express";
import { newInterviewSchemaToInsertSchema, newInterviewToInsertSchema } from "../request-handling/interviews";
import { clientError, serverError } from "../error/http-errors";
import { insertInterview, insertInterviewSchema, selectInterviewSchemas, selectInterviewSchemaWithId } from "../db-access/interviews";
import { validateJsonSchema } from "@/lib/json-schema";
import { JSONSchemaType } from "ajv";
import { serialIdParser, toListQueryParser, toSerialIdParser } from "../request-handling/common";
import { param } from "drizzle-orm";


const interviewsRouter = Router();

interviewsRouter.post("/", async (req, res, next) => {
	const bodyResult = newInterviewToInsertSchema.safeParse(req.body);
	if (!bodyResult.success) {
		next(clientError(400, "Invalid input data", bodyResult.error));
		return;
	}
	const body = bodyResult.data;
	if(body.interviewAnswers !== undefined) {
		const interviewSchemaResult = await selectInterviewSchemaWithId([body.interviewSchemaId]);
		
		if(!interviewSchemaResult.success) {
			next(clientError(404, "Resource not available", bodyResult.error));
			return;
		}
		
		// We assume that jsonschemas already in the database are valid.
		const interviewJsonSchema = interviewSchemaResult.data[0].jsonSchema as JSONSchemaType<unknown>;
		
		const jsonSchemaValidationResult = validateJsonSchema(interviewJsonSchema, body.interviewAnswers);
		
		if(!jsonSchemaValidationResult.success) {
			next(clientError(422, "Invalid request format", jsonSchemaValidationResult.error));
			return;
		}
	}

	const databaseResult = await insertInterview([body]);
	if (!databaseResult.success) {
		next(clientError(400, "Database error", databaseResult.error));
		return;
	}

	res.json(databaseResult.data);
});

interviewsRouter.post("/schema", async (req, res, next) => {
	const bodyResult = newInterviewSchemaToInsertSchema.safeParse(req.body);
	if(!bodyResult.success) {
		next(clientError(400, "Invalid input data", bodyResult.error));
		return;
	}
	const body = bodyResult.data;
	const databaseResult = await insertInterviewSchema([body]);
	
	if(!databaseResult.success) {
		next(clientError(400, "Database error", databaseResult.error));
		return;
	}
	res.json(databaseResult.data);
});

interviewsRouter.get("/schema/:id", async (req, res, next) => {
	const idParameterResult = toSerialIdParser.safeParse(req.params.id);
	if(!idParameterResult.success) {
		next(clientError(400, "Invalid input data", idParameterResult.error));
		return;
	}
	const schemaResult = await selectInterviewSchemaWithId([idParameterResult.data]);
	if(!schemaResult.success) {
		next(clientError(400, "Database error", schemaResult.error));
		return;
	}
	res.json(schemaResult.data);
});

interviewsRouter.get("/schema", async (req, res, next) => {
	const queryResult = toListQueryParser.safeParse(req.query);
	if(!queryResult.success) {
		next(clientError(400, "Invalid input data", queryResult.error));
		return;
	}
	const dbResult = await selectInterviewSchemas(queryResult.data);
	if(!dbResult.success) {
		next(serverError(500, "Data processing error", dbResult.error));
		return;
	}
	res.json(dbResult.data);
});
