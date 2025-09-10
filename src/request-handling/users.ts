import {
	assistantUsersTable,
	teamUsersTable,
	usersTable,
} from "@/db/tables/users";
import { norwegianBankAccountNumberParser } from "@/lib/finance-parsers";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRequestParser = z
	.strictObject({
		firstName: z.string().nonempty(),
		lastName: z.string().nonempty(),
		fieldOfStudyId: serialIdParser,
		bankAccountNumber: z.string().length(11),
		personalEmail: z.email({ pattern: z.regexes.html5Email }),
		phoneNumber: z.string().min(8),
	});

export const teamUserRequestParser = z
	.strictObject({
		id: serialIdParser,
		teamId: serialIdParser,
		username: z.string().nonempty(),
	});

export const assistantUserRequestParser = z
	.strictObject({
		id: serialIdParser,
	});

export const userRequestToInsertParser = userRequestParser
	.extend({
		firstName: userRequestParser.shape.firstName.trim(),
		lastName: userRequestParser.shape.lastName.trim(),
		bankAccountNumber: userRequestParser.shape.bankAccountNumber.pipe(
			norwegianBankAccountNumberParser,
		),
	})
	.pipe(createInsertSchema(usersTable).readonly());

export const teamUserRequestToInsertParser = teamUserRequestParser
	.extend({
		username: teamUserRequestParser.shape.username.trim(),
	})
	.pipe(createInsertSchema(teamUsersTable).readonly());

export const assistantUserRequestToInsertParser = assistantUserRequestParser
	.extend({})
	.pipe(createInsertSchema(assistantUsersTable).readonly());

export type NewUser = z.infer<typeof userRequestToInsertParser>;
export type NewTeamUser = z.infer<typeof teamUserRequestToInsertParser>;
export type NewAssistantUser = z.infer<
	typeof assistantUserRequestToInsertParser
>;
