import { z } from "zod";

// modified from https://github.com/colinhacks/zod/discussions/839#discussioncomment-4335236
// deleted

const phoneNumberRegex = /^\d{8}$/;
export const phoneNumberParser = z
	.string()
	.regex(phoneNumberRegex, "Phone number must be 8 digits");
