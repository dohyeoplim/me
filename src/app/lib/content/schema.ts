import { z } from "zod";

export const SIZE_TOKENS = [
    "title1",
    "title2",
    "head",
    "body1",
    "body2",
    "body3",
    "caption",
] as const;

export const COLOR_TOKENS = ["default", "muted", "subtle", "faint"] as const;

export const ALIGN_TOKENS = ["left", "center", "right"] as const;

export const WEIGHT_TOKENS = ["light", "regular", "medium"] as const;

export const BlockStyleSchema = z
    .object({
        size: z.enum(SIZE_TOKENS).optional(),
        color: z.enum(COLOR_TOKENS).optional(),
        align: z.enum(ALIGN_TOKENS).optional(),
        weight: z.enum(WEIGHT_TOKENS).optional(),
    })
    .optional();

const withId = {
    id: z.string(),
    style: BlockStyleSchema,
};

export const SectionLabelStyleSchema = z.enum(["caption", "head"]);

export const SectionNodeSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("item"),
        title: z.string(),
        subtitle: z.string().optional(),
        meta: z.string().optional(),
    }),
    z.object({
        type: z.literal("enumerate"),
        items: z.array(z.string()),
    }),
    z.object({
        type: z.literal("spacer"),
        size: z.union([z.number(), z.string()]).optional(),
    }),
]);

export const BlockSchema = z.discriminatedUnion("type", [
    z.object({ ...withId, type: z.literal("text"), text: z.string() }),
    z.object({ ...withId, type: z.literal("heading"), text: z.string() }),
    z.object({ ...withId, type: z.literal("divider") }),
    z.object({
        ...withId,
        type: z.literal("spacer"),
        size: z.union([z.number(), z.string()]).optional(),
    }),
    z.object({
        ...withId,
        type: z.literal("section"),
        label: z.string().optional(),
        labelStyle: SectionLabelStyleSchema.optional(),
        gapClassName: z.string().optional(),
        content: z.array(SectionNodeSchema),
    }),
    z.object({
        ...withId,
        type: z.literal("item"),
        title: z.string(),
        subtitle: z.string().optional(),
        meta: z.string().optional(),
    }),
    z.object({
        ...withId,
        type: z.literal("enumerate"),
        items: z.array(z.string()),
    }),
    z.object({
        ...withId,
        type: z.literal("project"),
        name: z.string(),
        year: z.string().optional(),
        month: z.string().optional(),
        tagline: z.string().optional(),
        description: z.string().optional(),
        meta: z.string().optional(),
    }),
]);

export const ContentDocSchema = z.object({
    sectionTitle: z
        .object({ title: z.string(), subtitle: z.string().optional() })
        .optional(),
    widthClassName: z.string().optional(),
    gapClassName: z.string().optional(),
    blocks: z.array(BlockSchema),
});

export const EntrySchema = z.object({
    id: z.string(),
    type: z.string(),
    slug: z.string(),
    title: z.string(),
    status: z.enum(["draft", "published"]),
    orderIndex: z.number(),
    doc: ContentDocSchema,
    updatedAt: z.string(),
});

export type BlockStyle = z.infer<typeof BlockStyleSchema>;
export type SectionNode = z.infer<typeof SectionNodeSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type BlockType = Block["type"];
export type SectionLabelStyle = z.infer<typeof SectionLabelStyleSchema>;
export type ContentDoc = z.infer<typeof ContentDocSchema>;
export type Entry = z.infer<typeof EntrySchema>;
