import { hostingStringParser, toPortParser } from "@/lib/network-parsers";
import "dotenv/config";
import { env } from "node:process";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const hostOptionsResult = z
	.object({
		PORT: toPortParser,
		HOSTING_URL: hostingStringParser,
	})
	.transform((schema) => {
		return {
			port: schema.PORT,
			hostingUrl: schema.HOSTING_URL,
		};
	})
	.safeParse(env);

if (!hostOptionsResult.success) {
	console.error("Error when parsing enviroment variables.");
	console.error(fromZodError(hostOptionsResult.error).message);
	process.exit(1);
}

export const hostOptions = hostOptionsResult.data;

const mailOptionsResult = z
	.object({
		GOOGLE_FROM_EMAIL: z.string().email(),
		GOOGLE_CLIENT_ID: z.string().nonempty(),
		GOOGLE_CLIENT_SECRET: z.string().nonempty(),
		GOOGLE_REFRESH_TOKEN: z.string().nonempty(),
	})
	.transform((schema) => ({
		fromEmail: schema.GOOGLE_FROM_EMAIL,
		clientId: schema.GOOGLE_CLIENT_ID,
		clientSecret: schema.GOOGLE_CLIENT_SECRET,
		refreshToken: schema.GOOGLE_REFRESH_TOKEN,
	}))
	.safeParse(env);

if (!mailOptionsResult.success) {
	console.error("Error when parsing environment variables.");
	console.error(fromZodError(mailOptionsResult.error).message);
	process.exit(1);
}

export const mailOptions = mailOptionsResult.data;
