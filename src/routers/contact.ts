import { clientError } from "@/src/error/http-errors";
import { Router, json } from "express";
import { sendEmail } from "@/src/services/mail-service"
import { z } from "zod";

export const contactRouter = Router();
contactRouter.use(json());

/**
 * @openapi
 * /contact:
 *  post:
 *   tags: [contact]
 *   summary: Send a contact email
 *   description: Send an email to contact, using the configured mail service.
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - receivingEmail
 *         - replyTo
 *         - about
 *        properties:
 *          receivingEmail:
 *            type: string
 *            format: email
 *            description: Recipient email address
 *          replyTo:
 *            type: string
 *            format: email
 *            nullable: true
 *            description: Optional reply-to address
 *          about:
 *            type: string
 *            description: Email subject
 *          text:
 *            type: string
 *            nullable: true
 *            description: Plain text email body
 *          html:
 *            type: string
 *            nullable: true
 *            description: HTML email body
 *   responses:
 *    200:
 *     description: Email sent successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        example: Successfully sent the email!
 *    400:
 *     description: Invalid request format
 */
contactRouter.post("/", async (req, res, next) => {
    const contactSchema = z.object({
        receivingEmail: z.string().email(),
        replyTo: z.string().email(),
        about: z.string().min(1),
        text: z.string().optional(),
        html: z.string().optional(),
    });

    const result = contactSchema.safeParse(req.body);

    if (!result.success) {
        return next(
            clientError(400, "Invalid request format", result.error),
        );
    }

    const {
        receivingEmail,
        replyTo,
        about,
        text,
        html,
    } = result.data;

    try {
        await sendEmail(
            receivingEmail,
            replyTo,
            about,
            text,
            html,
        );

        res.json("Successfully sent the email!");
    } catch (error) {
        console.error("CONTACT EMAIL ERROR:", error);
        next(error);
    }
});
