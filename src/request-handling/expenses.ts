import { expensesTable } from "@/db/tables/expenses";
import {
	currencyParser,
	norwegianBankAccountNumberParser,
} from "@/lib/finance-parsers";
import { timeStringParser } from "@/lib/time-parsers";
import { parseWithSchema } from "@/lib/zod";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const expenseInsertSchema = createInsertSchema(expensesTable)
	.strict()
	.readonly();

export const expenseRequestParser = z
	.object({
		userId: serialIdParser.describe("Id of user requesting expense"),
		title: z.string().min(1).describe("Title of expense"),
		moneyAmount: currencyParser.describe("Amount of money used"),
		description: z.string().min(1).describe("Description of expense"),
		bankAccountNumber: z
			.string()
			.length(11)
			.describe("Norwegian account number"),
		purchaseTime: timeStringParser.describe("Time of purcase"),
	})
	.strict();
export const expenseRequestToInsertParser = expenseRequestParser
	.extend({
		title: expenseRequestParser.shape.title.trim(),
		description: expenseRequestParser.shape.description.trim(),
		bankAccountNumber: expenseRequestParser.shape.bankAccountNumber.transform(
			parseWithSchema(norwegianBankAccountNumberParser),
		),
		purchaseTime: expenseRequestParser.shape.purchaseTime.transform(
			parseWithSchema(z.coerce.date().max(new Date())),
		),
	})
	.transform(({ bankAccountNumber, ...expense }) => ({
		...expense,
		accountNumber: bankAccountNumber,
	}))
	.transform(parseWithSchema(expenseInsertSchema));

export type NewExpense = z.infer<typeof expenseRequestToInsertParser>;
