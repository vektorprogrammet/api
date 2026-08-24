import { clientError } from "@/src/error/http-errors";
import {
    listQueryParser,
} from "@/src/request-handling/common";
import { Router, json } from "express";
import { sendEmail } from "@/src/routers/mail-service"

export const emailRouter = Router();
emailRouter.use(json());

/**
 * @openapi
 * /email:
 *  post:
 *   tags: [email]
 *   summary: Send an email
 *   description: Send an email using the configured mail service.
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
emailRouter.post("/", async (req, res, next) => {
    const queryParametersResult = listQueryParser.safeParse(req.query);
    if (!queryParametersResult.success) {
        return next(
            clientError(400, "Invalid request format", queryParametersResult.error),
        );
    }

    try {
        await sendEmail(
            req.body.receivingEmail,
            req.body.replyTo,
            req.body.about,
            req.body.text,
            req.body.html,
        );

        res.json("Successfully sent the email!");
    } catch (error) {
        next(error);
    }
});
