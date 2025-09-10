import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SORT_OPTION } from "@/lib/global-variables";
import { optional, z } from "zod";

export const sortParser = z
	.enum(["desc", "asc"])
	.default(DEFAULT_QUERY_SORT_OPTION)
	.meta({
		id: "sort-keyword",
		description: "Accepts strings with descending(desc) or ascending(asc)"
	})
export const limitParser = z
	.number()
	.positive()
	.int()
	.default(DEFAULT_QUERY_LIMIT)
	.meta({
		id: "limit",
		description: "For limits of amount of items to return. Must be a positive integer."
	})
export const toLimitParser = z
	.union([z.number(), z.string().transform(Number), z.undefined()])
	.pipe(limitParser);

export const offsetParser = z
	.number()
	.nonnegative()
	.int()
	.default(0)
	.meta({
		id: "offset",
		description: "Offset for pagination."
	})
export const toOffsetParser = z
	.union([z.number(), z.string().transform(Number), z.undefined()])
	.pipe(offsetParser);

export const listQueryParser = z.object({
	sort: sortParser,
	limit: limitParser,
	offset: offsetParser,
}).strict();

export const toListQueryParser = z
	.object({
		sort: sortParser,
		limit: toLimitParser,
		offset: toOffsetParser,
	}).strict();

export type QueryParameters = z.infer<typeof listQueryParser>;

export const serialIdParser = z.int().positive();
export const toSerialIdParser = z
	.union([z.number(), z.string().transform(Number)])
	.pipe(serialIdParser);
