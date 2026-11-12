import { Router, json } from "express";
import { selectCurrentSemesterByDepartmentId } from "../db-access/smesters";
import { clientError } from "../error/http-errors";
import { toSerialIdParser } from "../request-handling/common";

export const semestersRouter = Router();
semestersRouter.use(json());

/**
 * @openapi
 * /semesters/current/{departmentId}:
 *  get:
 *   tags: [semesters]
 *   summary: Get current semester in department
 *   description: Return current semester in department
 *   parameters:
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/semesters"
 */
semestersRouter.get("/current/:departmentId/", async (req, res, next) => {
	const departmentIdResult = toSerialIdParser.safeParse(
		req.params.departmentId,
	);
	if (!departmentIdResult.success) {
		return next(
			clientError(400, "Invalid request format", departmentIdResult.error),
		);
	}

	const databaseResult = await selectCurrentSemesterByDepartmentId(
		departmentIdResult.data,
	);
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
