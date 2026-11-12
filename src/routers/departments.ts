import { Router, json } from "express";
import { selectAllDepartments } from "../db-access/departments";
import { clientError } from "../error/http-errors";
import { toListQueryParser } from "../request-handling/common";

export const departmentsRouter = Router();
departmentsRouter.use(json());

/**
 * @openapi
 * /departments/:
 *  get:
 *   tags: [departments]
 *   summary: Get all departments
 *   description: Return all departments
 *   parameters:
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/departments"
 */
departmentsRouter.get("/", async (req, res, next) => {
	const queryParametersResult = toListQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(
			clientError(400, "Invalid request format", queryParametersResult.error),
		);
	}

	const results = await selectAllDepartments();
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
