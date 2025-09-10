import { z } from "zod";

export const portParser = z
	.number({
		error: (issue) => issue.input === undefined 
				? "port number needed"
				: "not a valid port number, must be a number"
	})
	.nonnegative("ports cannot be negative numbers")
	.max(65535, "ports cannot be higher than 65535(2^16 - 1)")
	.int("ports must have integer values");

export const toPortParser = z
	.union([z.number().int(), z.string()])
	.pipe(z.coerce.number())
	.pipe(portParser);

export const hostingStringParser = z.union(
	[z.literal("localhost"), z.url(), z.ipv4(), z.ipv6()],
	{
		error: (issue) => issue.input === undefined
			? "host string needed"
			: "not a valid host string, must be localhost, a url or an IP-adress"
	},
);
