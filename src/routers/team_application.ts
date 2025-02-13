import {
	selectTeamApplications,
	selectTeamApplicationsByTeamId,
} from "@src/db-access/team_applications";
import { clientError } from "@src/error/httpErrors";
import { listQueryParser, serialIdParser } from "@src/request-handling/common";
import { Router, urlencoded } from "express";

export const teamApplicationRouter = Router();

teamApplicationRouter.use(urlencoded({ extended: true }));

teamApplicationRouter.get("/", async (req, res, next) => {
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(clientError(400, "", queryParametersResult.error));
	}

	const results = await selectTeamApplications(queryParametersResult.data);
	if (!results.success) {
		return next(clientError(400, "Database error", results.error));
	}
	res.json(results.data);
});

teamApplicationRouter.get("/:teamID/", async (req, res, next) => {
	const teamIdResult = serialIdParser.safeParse(req.params.teamID);
	if (!teamIdResult.success) {
		return next(clientError(400, "", teamIdResult.error));
	}
	const queryParametersResult = listQueryParser.safeParse(req.query);
	if (!queryParametersResult.success) {
		return next(clientError(400, "", queryParametersResult.error));
	}
	const databaseResult = await selectTeamApplicationsByTeamId(
		[teamIdResult.data],
		queryParametersResult.data,
	);
	if (!databaseResult.success) {
		return next(clientError(400, "Database error", databaseResult.error));
	}
	res.json(databaseResult.data);
});
