import { clientError, isHttpError, serverError } from "@/src/error/http-errors";
import { isOrmError } from "@/src/error/orm-error";
import type { ErrorRequestHandler } from "express";
import { isZodErrorLike } from "zod-validation-error";

export const httpErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (isHttpError(err)) {
		return res
			.status(err.getResponseCode())
			.json({ error: true, message: err.getResponseString() });
	}
	return next(err);
};

export const ormErrorHandler: ErrorRequestHandler = (err, _req, _res, next) => {
	if (isOrmError(err)) {
		if (err.isClientFault()) {
			return next(clientError(400, "Database error"));
		}
		return next(serverError(500, "Data processing error"));
	}
	return next(err);
};

export const zodErrorHandler: ErrorRequestHandler = (err, _req, _res, next) => {
	if (isZodErrorLike(err)) {
		return next(clientError(401, "Bad request syntax"));
	}
	return next(err);
};

export const errorHandler: ErrorRequestHandler = (_err, _req, res, _next) => {
	console.warn("WARNING! DEFAULT EXPRESS ERRORHANDLER IS USED.");
	res.status(500).json({ error: true, message: "Unknown error." });
};
