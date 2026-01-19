import Ajv, { type ErrorObject, type AnySchema } from "ajv";
import z from "zod";

type JsonSchemaResult =
	| {
			success: true;
	  }
	| {
			success: false;
			error: ErrorObject[];
	  };

const ajv = new Ajv();

export function validateJsonSchema(
	schema: AnySchema,
	data: unknown,
): JsonSchemaResult {
	const validator = ajv.compile(schema);
	const isValid = validator(data);
	if (isValid) {
		return { success: true };
	}
	return {
		success: false,
		error: validator.errors === undefined || 
			validator.errors === null ? [] : validator.errors,
	};
}


export function turnJsonIntoZodSchema(
	schema: AnySchema
) {
	return z.object({}).passthrough().superRefine((data, ctx) => {
		let validationResult = validateJsonSchema(schema, data);
		if (!validationResult.success) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "The interview schema is not valid",
				params: validationResult.error,
			});
		}

		return validationResult.success;
	});

}

// from: https://www.reddit.com/r/typescript/comments/13mssvc/types_for_json_and_writing_json
type JsonPrimative = string | number | boolean | null;
type JsonArray = Json[];
type JsonObject = { [key: string]: Json };
type JsonComposite = JsonArray | JsonObject;
export type Json = JsonPrimative | JsonComposite;
