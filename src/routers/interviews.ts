import { Router } from "express";
import { newInterviewSchemaToInsertSchema, newInterviewToInsertSchema } from "../request-handling/interviews";
import { clientError } from "../error/http-errors";
import { insertInterviewSchema, selectInterviewSchemaWithId } from "../db-access/interviews";
import { validateJsonSchema } from "@/lib/json-schema";
import { JSONSchemaType } from "ajv";


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

	// TODO: insert interview
	// TODO: return
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
