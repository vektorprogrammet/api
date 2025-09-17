import { sponsorsTable } from "@/db/tables/sponsors";
import { timeStringParser } from "@/lib/time-parsers";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sponsorRequestParser = z
	.strictObject({
		id: serialIdParser.optional(),
		name: z.string(),
		homePageUrl: z.url(),
		startTime: timeStringParser,
		endTime: timeStringParser.optional().nullable(),
		size: z
			.enum(["small", "medium", "large"]),
		spesificDepartmentId: serialIdParser.nullable()
			.optional(),
	})
	.meta({
		id: "sponsor-request"
	});

export const sponsorRequestToInsertParser = sponsorRequestParser
	.extend({
		name: sponsorRequestParser.shape.name.trim(),
		startTime: sponsorRequestParser.shape.startTime.pipe(
			z.coerce.date(),
		).pipe(z.date().max(new Date())),
		endTime: sponsorRequestParser.shape.endTime.pipe(z.coerce.date()).nullable().optional(),
	})
	.pipe(createInsertSchema(sponsorsTable).readonly());
const x = createInsertSchema(sponsorsTable)
type X = z.infer<typeof x>;
export type NewSponsor = z.infer<typeof sponsorRequestToInsertParser>;
