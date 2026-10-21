import { z } from "zod";

export function parseWithSchema<T extends z.ZodType>(schema: T) {
	return (value: unknown, ctx: z.RefinementCtx): z.output<T> => {
		const result = schema.safeParse(value);
		if (!result.success) {
			for (const issue of result.error.issues) {
				ctx.addIssue({ ...issue });
			}
			return z.NEVER;
		}
		return result.data;
	};
}

// modified from https://github.com/colinhacks/zod/discussions/839#discussioncomment-4335236
export function zodEnumFromObjKeys<K extends string>(
	obj: Record<K, unknown>,
): z.ZodEnum<Record<K, K>> {
	const keys = Object.keys(obj) as K[];
	return z.enum(keys);
}
const phoneNumberRegex = /^\d{8}$/;
export const phoneNumberParser = z
	.string()
	.regex(phoneNumberRegex, "Phone number must be 8 digits");
