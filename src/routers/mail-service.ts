import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    // auth: {
    //     type: "OAuth2",
    //     user: process.env.GMAIL_USER,
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    // },
});

export async function sendEmail(to: string, replyTo: string, subject: string, text?: string, html?: string) {
    await transporter.sendMail({
        from: `"Vektorprogrammet" <${process.env.GMAIL_USER}>`,
        to,
        replyTo,
        subject,
        text,
        html,
    });
}
