import { Router, json } from "express";
import { selectCurrentSemesterByDepartmentId } from "../db-access/semesters";
import { clientError } from "../error/http-errors";
import { toSerialIdParser } from "../request-handling/common";

export const semestersRouter = Router();
semestersRouter.use(json());

/**
 * @openapi
 * /semesters/current/{departmentId}:
 *  get:
 *   tags: [semesters]
 *   summary: Get the recruiting or current semester for a department
 *   description: Prefer a semester with open recruitment, otherwise return the ongoing semester. Return null if neither exists.
 *   parameters:
 *    - in: path
 *      name: departmentId
 *      required: true
 *      schema:
 *       type: integer
 *       minimum: 1
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        oneOf:
 *         - $ref: "#/components/schemas/semester"
 *         - type: "null"
 */
semestersRouter.get("/current/:departmentId/", async (req, res, next) => {
	const departmentIdResult = toSerialIdParser.safeParse(
		Number(req.params.departmentId),
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
