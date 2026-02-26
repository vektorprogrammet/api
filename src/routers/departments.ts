import { clientError } from "@/src/error/http-errors";
import {
    toListQueryParser,
} from "@/src/request-handling/common";
import { Router, json } from "express";
import { selectDepartments } from "../db-access/departments";

export const departmentsRouter = Router();
departmentsRouter.use(json());

/**
 * @openapi
 * /departments:
 *  get:
 *   tags: [departments]
 *   summary: Get departments
 *   description: Get departments
 *   parameters:
 *    - $ref: "#/components/parameters/offset"
 *    - $ref: "#/components/parameters/limit"
 *    - $ref: "#/components/parameters/sort"
 *   responses:
 *    200:
 *     description: Successfull response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: "#/components/schemas/department"
 */
departmentsRouter.get("/", async (req, res, next) => {
    const queryParametersResult = toListQueryParser.safeParse(req.query);
    if (!queryParametersResult.success) {
        return next(
            clientError(400, "Invalid request format", queryParametersResult.error),
        );
    }
    const databaseResult = await selectDepartments(queryParametersResult.data);
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

