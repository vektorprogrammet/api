import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_FROM_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

// Remember to add protection to prevent people from using the endpoint to send arbitrary emails from the mailbot.
export async function sendEmail(to: string, replyTo: string, subject: string, text?: string, html?: string) {
    await transporter.sendMail({
        from: `"Vektorprogrammet" <${process.env.GOOGLE_FROM_EMAIL}>`,
        to,
        replyTo,
        subject,
        text,
        html,
    });
};