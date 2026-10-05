import { parseWithSchema } from "@/lib/zod";
import { z } from "zod";

export const timeStringParser = z.union([
	z.iso.date(),
	z.iso.time(),
	z.iso.datetime(),
]);

// Date here refers to the JS object date, so it allows more specific times than dates
export const toDateParser = z
	.union([timeStringParser, z.date()])
	.transform(parseWithSchema(z.coerce.date()));

export const datePeriodParser = z
	.object({
		startDate: z.date(),
		endDate: z.date(),
	})
	.refine((datePeriod) => {
		return datePeriod.startDate.getTime() <= datePeriod.endDate.getTime();
	}, "Invalid date period. StartDate must be before or equal to endDate.");

export const toDatePeriodParser = z
	.object({
		startDate: toDateParser,
		endDate: toDateParser,
	})
	.transform(parseWithSchema(datePeriodParser));

export const pastDateParser = z.date().max(new Date());
export const futureDateParser = z.date().min(new Date());

export type DatePeriod = z.infer<typeof datePeriodParser>;
