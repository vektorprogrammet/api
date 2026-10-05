import { isIP } from "node:net";
import { z } from "zod";

export const portParser = z
	.number({ error: "not a valid port. must be a number" })
	.nonnegative("ports cannot be negative numbers")
	.max(65535, "ports cannot be higher than 65535(2^16 - 1)")
	.finite()
	.safe()
	.int("ports must have integer values");

export const toPortParser = z.coerce.number().pipe(portParser);

export const hostingStringParser = z.union(
	[
		z.literal("localhost"),
		z.string().url(),
		z.string().refine((value) => isIP(value) !== 0, "not a valid IP address"),
	],
	{
		error: "not a valid host string, must be localhost, a url or an IP-adress",
	},
);
