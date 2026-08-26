import { env } from "node:process";
import type { ConnectionOptions } from "node:tls";
import { hostingStringParser, toPortParser } from "@/lib/network-parsers";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

function getCaCert(): string | Buffer | (string | Buffer)[] | undefined {
	return env.CA_CERT;
}

const parametersResult = z
	.object({
		DATABASE_HOST: hostingStringParser,
		DATABASE_NAME: z.string().nonempty(),
		DATABASE_USER: z.string().nonempty(),
		DATABASE_PASSWORD: z.string().nonempty(),
		DATABASE_PORT: toPortParser,
		DATABASE_SSL_OPTION: z
			.enum(["prod", "prod-provide_ca_cert", "dev", "true", "false"])
			.default("prod"),
	})
	.transform((schema, ctx) => {
		let ssl: boolean | ConnectionOptions;
		switch (schema.DATABASE_SSL_OPTION) {
			case "prod":
				ssl = {
					requestCert: true,
					rejectUnauthorized: true,
				};
				break;
			case "prod-provide_ca_cert": {
				const caCert = getCaCert();
				if (caCert === undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Could not find ca certificate",
						path: ["DATABASE_SSL_OPTION"],
					});
					return z.NEVER;
				}
				ssl = {
					requestCert: true,
					rejectUnauthorized: true,
					ca: caCert,
				};
				break;
			}
			case "dev":
				ssl = {
					requestCert: true,
					rejectUnauthorized: false,
				};
				break;
			case "true":
				ssl = true;
				break;
			case "false":
				ssl = false;
				break;
		}
		return {
			host: schema.DATABASE_HOST.trim(),
			database: schema.DATABASE_NAME.trim(),
			user: schema.DATABASE_USER.trim(),
			password: schema.DATABASE_PASSWORD.trim(),
			port: schema.DATABASE_PORT,
			ssl,
		};
	})
	.safeParse(env);

if (!parametersResult.success) {
	console.error("Error when parsing enviroment variables.");
	console.error(fromZodError(parametersResult.error).message);
	process.exit(1);
}
export const databaseConnectionParameters = parametersResult.data;

if (env.LOG_DATABASE_CREDENTIALS_ON_STARTUP === "true") {
	console.info("Database parameters:", databaseConnectionParameters);
}
