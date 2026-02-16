import "dotenv/config";
import { hostOptions } from "@/src/enviroment";
import {
	errorHandler,
	httpErrorHandler,
	jsonParsingErrorHandler,
	ormErrorHandler,
	zodErrorHandler,
} from "@/src/middleware/error-middleware";
import { logger } from "@/src/middleware/logging-middleware";
import { assistantApplicationRouter, teamApplicationRouter } from "@/src/routers/applications";
import { expensesRouter } from "@/src/routers/expenses";
import { sponsorsRouter } from "@/src/routers/sponsors";
import { teamsRouter } from "@/src/routers/teams";
import { usersRouter } from "@/src/routers/users";
import { customCors, customHelmetSecurity } from "@/src/security";
import express from "express";

export const api = express();

// Security
api.use(customHelmetSecurity, customCors());
api.disable("x-powered-by");

// OpenAPI
api.use("/api-docs.yaml", express.static("./openapi/openapi-document.yaml"));
api.use("/api-docs.json", express.static("./openapi/openapi-document.json"));

// Logger
api.use(logger);

// Routes
api.use("/expenses", expensesRouter);

api.use("/sponsors", sponsorsRouter);

api.use("/users", usersRouter);

api.use("/teamapplications", teamApplicationRouter);

api.use("/assistantapplications", assistantApplicationRouter);

api.use("/teams", teamsRouter);

// Error handling
api.use(
	jsonParsingErrorHandler,
	ormErrorHandler,
	zodErrorHandler,
	httpErrorHandler,
	errorHandler,
);

api.listen(hostOptions.port, () => {
	console.info(
		`Listening on ${hostOptions.hostingUrl}. May need to specify port ${hostOptions.port}.`,
	);
});
