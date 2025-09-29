import {
	createTeamApplicationFromAssistantApplication,
	insertTeamApplication,
	selectTeamApplications,
	selectTeamApplicationsByTeamId,
} from "@/src/db-access/applications";
import { clientError } from "@/src/error/http-errors";
import { teamApplicationToInsertParser } from "@/src/request-handling/applications";
import {
	toListQueryParser,
	toSerialIdParser,
} from "@/src/request-handling/common";
import { Router, json } from "express";

export const teamApplicationRouter = Router();

teamApplicationRouter.use(json());

/**
 * @openapi
 * /teamapplications:
 *  get:
 *   tags: [teamapplications]
 *   summary: Get all teamapplications
 *   description: Get all teamapplications
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *   responses:
 *    201:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamApplication"
 */

teamApplicationRouter.get("/", async (req, res, next) => {
	const queryParametersResult = toListQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}

	const results = await selectTeamApplications(queryParametersResult.data);
	if (!results.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				results.error,
			),
		);
	}
	res.json(results.data);
});

/**
 * @openapi
 * /teamapplications/{teamId}/:
 *  get:
 *   tags: [teamapplications]
 *   summary: Get teamapplication with teamid
 *   description: Get teamapplication with teamid
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamApplication"
 */
teamApplicationRouter.get("/:teamID/", async (req, res, next) => {
	const teamIdResult = toSerialIdParser.safeParse(req.params.teamID);
	if (!teamIdResult.success) {
		return next(clientError(400, "Invalid request format", teamIdResult.error));
	}
	const queryParametersResult = toListQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}
	const databaseResult = await selectTeamApplicationsByTeamId(
		[teamIdResult.data],
		queryParametersResult.data,
	);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});

/**
 * @openapi
 * /teamapplications/:
 *  post:
 *   tags: [teamapplications]
 *   summary: Add teamapplication
 *   description: Add teamapplication
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/teamApplicationRequest"
 *   responses:
 *    201:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamApplication"
 */
teamApplicationRouter.post("/", async (req, res, next) => {
	const teamApplicationBodyResult = teamApplicationToInsertParser.safeParse(
		req.body,
	);

	if (!teamApplicationBodyResult.success) {
		const error = clientError(
			400,
			"Invalid request format",
			teamApplicationBodyResult.error,
		);
		return next(error);
	}
	const databaseResult = await insertTeamApplication(
		teamApplicationBodyResult.data,
	);
	if (!databaseResult.success) {
		const error = clientError(
			400,
			"Failed to execute the database command",
			databaseResult.error,
		);
		return next(error);
	}
	res.status(201).json(databaseResult.data);
});

/**
 * @openapi
 * /teamapplications/createFromAssistantApplication:
 *  post:
 *   tags: [teamapplications]
 *   summary: Make teamapplication from assistantapplication
 *   description: Make teamapplication from assistantapplication
 *   requestBody:
 *    required: true
 *    content:
 *     json:
 *      schema:
 *       $ref: "#/components/schemas/teamApplicationRequest"
 *   responses:
 *    201:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teamApplication"
 */
teamApplicationRouter.post("/createFromAssistantApplication/", async (req, res, next) => {
	const teamApplicationBodyResult = teamApplicationToInsertParser.safeParse(
		req.body,
	);

	if (!teamApplicationBodyResult.success) {
		const error = clientError(
			400,
			"Invalid request format",
			teamApplicationBodyResult.error,
		);
		return next(error);
	}
	const databaseResult = await createTeamApplicationFromAssistantApplication(
		teamApplicationBodyResult.data.applicationParentId,
		teamApplicationBodyResult.data.teamId,
		teamApplicationBodyResult.data.biography,
		teamApplicationBodyResult.data.motivationText,
	);
	if (!databaseResult.success) {
		const error = clientError(
			400,
			"Failed to execute the database command",
			databaseResult.error,
		);
		return next(error);
	}
	res.status(201).json(databaseResult.data);
});
