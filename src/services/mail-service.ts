import type { Result } from "@/lib/types";
import { mailOptions } from "@/src/enviroment";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	secure: true,
	// biome-ignore lint/style/useNamingConvention: Nodemailer requires the `requireTLS` option name.
	requireTLS: true,
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: mailOptions.fromEmail,
		clientId: mailOptions.clientId,
		clientSecret: mailOptions.clientSecret,
		refreshToken: mailOptions.refreshToken,
	},
});

export async function sendEmail(
	to: string,
	replyTo: string,
	subject: string,
	text?: string,
	html?: string,
): Promise<Result<void, Error>> {
	try {
		await transporter.sendMail({
			from: `"Vektorprogrammet" <${mailOptions.fromEmail}>`,
			to,
			replyTo,
			subject,
			text,
			html,
		});

		return { success: true, data: undefined };
	} catch (error: unknown) {
		return { success: false, error: new Error("Failed to send email", { cause: error })};
	}
}
