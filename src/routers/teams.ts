import {
	selectActiveTeamAndMembersByDepartmentAndTeam,
	selectActiveTeams,
	selectActiveTeamsOverview,
	selectHovedstyretContacts,
	selectInActiveTeams,
	selectTeamsById,
} from "@/src/db-access/teams";
import { clientError } from "@/src/error/http-errors";
import {
	listQueryParser,
	toListQueryParser,
	toSerialIdParser,
} from "@/src/request-handling/common";
import { Router, json } from "express";
import { z } from "zod";

export const teamsRouter = Router();
teamsRouter.use(json());

/**
 * @openapi
 * /teams/active/:
 *  get:
 *   tags: [teams]
 *   summary: Get all active teams
 *   description: Return all active teams
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teams"
 */
teamsRouter.get("/active", async (req, res, next) => {
	const queryParametersResult = toListQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}

	const results = await selectActiveTeams(queryParametersResult.data);
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
 * /teams/inactive/:
 *  get:
 *   tags: [teams]
 *   summary: Get all inactive teams
 *   description: Return all inactive teams
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teams"
 */
teamsRouter.get("/inactive", async (req, res, next) => {
	const queryParametersResult = toListQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}

	const results = await selectInActiveTeams(queryParametersResult.data);
	if (!results.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}
	res.json(results.data);
});

/**
 * @openapi
 * /teams/active/overview/:
 *  get:
 *   tags: [teams]
 *   summary: Get all active teams with department name and number of members
 *   description: Return all active teams with extra info
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/teams"
 */
teamsRouter.get("/active/overview", async (_req, res, next) => {
	const results = await selectActiveTeamsOverview();
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
 * /teams/hovedstyret/contacts:
 *  get:
 *   tags: [teams]
 *   summary: Get contact information for Hovedstyret members
 *   description: Return first name, last name, company email and role title for all active Hovedstyret members
 *   responses:
 *    200:
 *     description: Successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          firstName:
 *           type: string
 *          lastName:
 *           type: string
 *          mail:
 *           type: string
 *           nullable: true
 *          title:
 *           type: string
 */
teamsRouter.get("/hovedstyret/contacts", async (_req, res, next) => {
	const result = await selectHovedstyretContacts();

	if (!result.success) {
		return next(
			clientError(
				400,
				"Failed to retrieve data from the database",
				result.error,
			),
		);
	}

	res.json(result.data);
});

/**
 * @openapi
 * /teams/{teamId}/:
 *  get:
 *   tags: [teams]
 *   summary: Get team with id
 *   description: Get team with id
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
teamsRouter.get("/:teamId/", async (req, res, next) => {
	const teamIdResult = toSerialIdParser.safeParse(req.params.teamId);
	if (!teamIdResult.success) {
		return next(clientError(400, "Invalid request format", teamIdResult.error));
	}
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}
	const databaseResult = await selectTeamsById([teamIdResult.data]);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});



/**
 * @openapi
 * /teams/{teamId}/:
 *  get:
 *   tags: [teams]
 *   summary: Get team with id
 *   description: Get team with id
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
teamsRouter.get("/active/full/", async (req, res, next) => {
	const queryResult = z
		.object({
			department: z.string().min(1),
			team: z.string().min(1),
		})
		.safeParse(req.query);

	if (!queryResult.success) {
		return next(
			clientError(400, "Invalid request format", queryResult.error),
		);
	}

	const { department, team } = queryResult.data;

	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}
	const databaseResult = await selectActiveTeamAndMembersByDepartmentAndTeam(department, team);
	if (!databaseResult.success) {
		return next(
			clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			),
		);
	}
	res.json(databaseResult.data);
});
