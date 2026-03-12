import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { clientError } from "../error/http-errors";
import type { OrmResult } from "../error/orm-error";
import type { QueryParameters } from "../request-handling/common";

type DatabaseCall<Req, Res> = (items: Req) => Promise<OrmResult<Res>>;

export function makeStandardBodyRequestHandler<Req, Res>(
	zodSchema: ZodSchema<Req>,
	databaseCall: DatabaseCall<Req[], Res>,
	options: { httpReturnCode: number } = { httpReturnCode: 200 },
): RequestHandler {
	return async (req, res, next) => {
		const requestResult = zodSchema.safeParse(req.body);
		if (!requestResult.success) {
			const error = clientError(
				400,
				"Invalid request format",
				requestResult.error,
			);
			return next(error);
		}
		const databaseResult = await databaseCall([requestResult.data]);
		if (!databaseResult.success) {
			const error = clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			);
			return next(error);
		}
		res.status(options.httpReturnCode).json(databaseResult.data);
	};
}

export function makeStandardQueryRequestHandler<Res>(
	zodSchema: ZodSchema<QueryParameters>,
	databaseCall: DatabaseCall<QueryParameters, Res>,
	options: { httpReturnCode: number } = { httpReturnCode: 200 },
): RequestHandler {
	return async (req, res, next) => {
		const requestResult = zodSchema.safeParse(req.query);
		if (!requestResult.success) {
			const error = clientError(
				400,
				"Invalid request format",
				requestResult.error,
			);
			return next(error);
		}
		const databaseResult = await databaseCall(requestResult.data);
		if (!databaseResult.success) {
			const error = clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			);
			return next(error);
		}
		res.status(options.httpReturnCode).json(databaseResult.data);
	};
}

export function makeStandardParameterHandler<Param, Res>(
	zodSchema: ZodSchema<Param>,
	databaseCall: DatabaseCall<Param, Res>,
	options: { httpReturnCode: number } = { httpReturnCode: 200 },
): RequestHandler {
	return async (req, res, next) => {
		const requestResult = zodSchema.safeParse(req.params);
		if (!requestResult.success) {
			const error = clientError(
				400,
				"Invalid request format",
				requestResult.error,
			);
			return next(error);
		}
		const databaseResult = await databaseCall(requestResult.data);
		if (!databaseResult.success) {
			const error = clientError(
				400,
				"Failed to execute the database command",
				databaseResult.error,
			);
			return next(error);
		}
		res.status(options.httpReturnCode).json(databaseResult.data);
	};
}
