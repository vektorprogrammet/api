import { expensesTable } from "@/db/tables/expenses";
import {
	currencyParser,
	norwegianBankAccountNumberParser,
} from "@/lib/finance-parsers";
import { timeStringParser } from "@/lib/time-parsers";
import { serialIdParser } from "@/src/request-handling/common";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenseRequestParser = z
	.object({
		userId: serialIdParser,
		title: z.string().min(1),
		moneyAmount: currencyParser,
		description: z.string().min(1),
		bankAccountNumber: z
			.string()
			.length(11),
		purchaseTime: timeStringParser,
	})
	.strict()
	.meta({
		id: "expense-request"
	});
export const expenseRequestToInsertParser = expenseRequestParser
	.extend({
		title: expenseRequestParser.shape.title.trim(),
		description: expenseRequestParser.shape.description.trim(),
		bankAccountNumber: expenseRequestParser.shape.bankAccountNumber.pipe(
			norwegianBankAccountNumberParser,
		),
		purchaseTime: expenseRequestParser.shape.purchaseTime.pipe(
			z.coerce.date().max(new Date()),
		),
	})
	.pipe(createInsertSchema(expensesTable).strict().readonly());

export type NewExpense = z.infer<typeof expenseRequestToInsertParser>;
