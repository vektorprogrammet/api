import "dotenv/config";
import { hostOptions } from "@/src/enviroment";
import {
	errorHandler,
	httpErrorHandler,
	ormErrorHandler,
	zodErrorHandler,
} from "@/src/middleware/error-middleware";
import { logger } from "@/src/middleware/logging-middleware";
import { openapiSpecification } from "@/src/openapi/config";
import { teamApplicationRouter } from "@/src/routers/applications";
import { expensesRouter } from "@/src/routers/expenses";
import { sponsorsRouter } from "@/src/routers/sponsors";
import { teamsRouter } from "@/src/routers/teams";
import { usersRouter } from "@/src/routers/users";
import { customCors, customHelmetSecurity } from "@/src/security";
import express from "express";
import openapiExpressHandler from "swagger-ui-express";

export const api = express();

// Security
api.use(customHelmetSecurity, customCors());
api.disable("x-powered-by");

// OpenAPI
api.get(
	"/docs/openapi",
	openapiExpressHandler.serve,
	openapiExpressHandler.setup(openapiSpecification),
);

// Logger
api.use(logger);

// Routes
api.use("/expenses", expensesRouter);

api.use("/sponsors", sponsorsRouter);

api.use("/users", usersRouter);

api.use("/teamapplications", teamApplicationRouter);
api.use("/teams", teamsRouter);

// Error handling
api.use(ormErrorHandler, zodErrorHandler, httpErrorHandler, errorHandler);

api.listen(hostOptions.port, () => {
	console.info(
		`Listening on ${hostOptions.hostingUrl}. May need to specify port ${hostOptions.port}.`,
	);
});
