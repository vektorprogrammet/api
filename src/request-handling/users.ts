import {
	assistantUsersTable,
	teamUsersTable,
	usersTable,
} from "@/db/tables/users";
import { norwegianBankAccountNumberParser } from "@/lib/finance-parsers";
import { parseWithSchema } from "@/lib/zod";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const userInsertSchema = createInsertSchema(usersTable).strict().readonly();
const teamUserInsertSchema = createInsertSchema(teamUsersTable)
	.strict()
	.readonly();
const assistantUserInsertSchema = createInsertSchema(assistantUsersTable)
	.strict()
	.readonly();

export const userRequestParser = z
	.object({
		firstName: z.string().nonempty(),
		lastName: z.string().nonempty(),
		fieldOfStudyId: serialIdParser,
		bankAccountNumber: z.string().length(11),
		personalEmail: z.string().email(),
		phoneNumber: z.string().min(8),
	})
	.strict();

export const teamUserRequestParser = z
	.object({
		id: serialIdParser,
		teamId: serialIdParser,
		username: z.string().nonempty(),
	})
	.strict();

export const assistantUserRequestParser = z
	.object({
		id: serialIdParser,
	})
	.strict();

export const userRequestToInsertParser = userRequestParser
	.extend({
		firstName: userRequestParser.shape.firstName.trim(),
		lastName: userRequestParser.shape.lastName.trim(),
		bankAccountNumber: userRequestParser.shape.bankAccountNumber.transform(
			parseWithSchema(norwegianBankAccountNumberParser),
		),
	})
	.transform(parseWithSchema(userInsertSchema));

export const teamUserRequestToInsertParser = teamUserRequestParser
	.extend({
		username: teamUserRequestParser.shape.username.trim(),
	})
	.transform(parseWithSchema(teamUserInsertSchema));

export const assistantUserRequestToInsertParser =
	assistantUserRequestParser.transform(
		parseWithSchema(assistantUserInsertSchema),
	);

export type NewUser = z.infer<typeof userRequestToInsertParser>;
export type NewTeamUser = z.infer<typeof teamUserRequestToInsertParser>;
export type NewAssistantUser = z.infer<
	typeof assistantUserRequestToInsertParser
>;
