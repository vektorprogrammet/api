import { z } from "zod";

const markdownBlockParser = z
	.object({
		type: z.literal("markdown"),
		id: z.string(),
		markdown: z.string(),
	})
	.strict();

const imageBlockParser = z
	.object({
		type: z.literal("image"),
		id: z.string(),
		src: z.string(),
		alt: z.string(),
	})
	.strict();

const contentWithImagesBlockParser = z
	.object({
		type: z.literal("contentWithImages"),
		id: z.string(),
		markdown: z.string().optional(),
		images: z.array(imageBlockParser),
	})
	.strict();

const sectionContentParser = z.discriminatedUnion("type", [
	markdownBlockParser,
	imageBlockParser,
	contentWithImagesBlockParser,
]);

const sectionBlockParser = z
	.object({
		type: z.literal("section"),
		id: z.string(),
		heading: z.string().optional(),
		content: z.array(sectionContentParser),
	})
	.strict();

export const teamDescriptionParser = z.array(sectionBlockParser);

export type TeamDescription = z.infer<typeof teamDescriptionParser>;
