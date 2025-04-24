type JsonError = SyntaxError;

export function isJsonParsingError(error: unknown): error is JsonError {
	return error instanceof SyntaxError;
}
