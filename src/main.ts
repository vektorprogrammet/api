import "dotenv/config";
import {
	errorHandler,
	httpErrorHandler,
	ormErrorHandler,
	zodErrorHandler,
} from "@/src/middleware/error-middleware";
import { logger } from "@/src/middleware/logging-middleware";
import express from "express";

import { expensesRouter } from "@/src/routers/expenses";
import { customCors, customHelmetSecurity } from "@/src/security";

import { teamApplicationRouter } from "@/src/routers/team-applications";

import { hostOptions } from "@/src/enviroment";
import { openapiSpecification } from "@/src/openapi/config";
import { sponsorsRouter } from "@/src/routers/sponsors";
import { usersRouter } from "@/src/routers/users";
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

// Error handling
api.use(ormErrorHandler, zodErrorHandler, httpErrorHandler, errorHandler);

api.listen(hostOptions.port, () => {
	console.info(
		`Listening on ${hostOptions.hostingUrl}. May need to specify port ${hostOptions.port}.`,
	);
});
