import { z } from "zod";
import { profileCardRegistry } from "./types";

export const documentIdSchema = z.string().regex(/^[a-z0-9][a-z0-9._-]{0,119}$/);
export const cardIdSchema = z.enum(Object.keys(profileCardRegistry) as [keyof typeof profileCardRegistry]);

const markupPattern = /<[^>]+>|https?:\/\/|www\.|\[[^\]]*\]\(|(^|\n)\s*#{1,6}\s|`/i;

function plainText(maximum: number) {
    return z.string().trim().min(1).max(maximum).refine((value) => !markupPattern.test(value));
}

const sourceIdsSchema = z.array(documentIdSchema).min(1).max(6);
const blockBase = { title: plainText(90), sourceIds: sourceIdsSchema };

export const profileAnswerBlockSchema = z
    .discriminatedUnion("type", [
        z.object({
            type: z.literal("facts"),
            ...blockBase,
            items: z.array(z.object({ label: plainText(60), value: plainText(200) }).strict()).min(2).max(6),
        }).strict(),
        z.object({
            type: z.literal("steps"),
            ...blockBase,
            items: z.array(z.object({ title: plainText(70), description: plainText(220) }).strict()).min(2).max(6),
        }).strict(),
        z.object({
            type: z.literal("comparison"),
            ...blockBase,
            columns: z.array(plainText(60)).min(2).max(3),
            rows: z.array(z.object({
                label: plainText(60),
                values: z.array(plainText(140)).min(2).max(3),
            }).strict()).min(2).max(5),
        }).strict(),
        z.object({
            type: z.literal("timeline"),
            ...blockBase,
            items: z.array(z.object({
                date: plainText(60),
                title: plainText(70),
                description: plainText(200),
            }).strict()).min(2).max(5),
        }).strict(),
    ])
    .refine((block) => {
        return block.type !== "comparison" || block.rows.every((row) => row.values.length === block.columns.length);
    });

export const profileFollowUpSchema = z.object({
    label: plainText(70),
    question: plainText(180),
    sourceIds: sourceIdsSchema,
}).strict();

export const generatedAnswerSchema = z.object({
    grounding: z.enum(["supported", "unsupported"]),
    answer: plainText(1200),
    sourceIds: z.array(documentIdSchema).max(6),
    cardIds: z.array(cardIdSchema).max(4),
    blocks: z.array(profileAnswerBlockSchema).max(2),
    followUps: z.array(profileFollowUpSchema).max(4),
    repositories: z.array(z.object({ sourceId: documentIdSchema, reason: plainText(160) }).strict()).max(3),
}).strict();

const sourceUrlSchema = z.string().max(2000).refine((value) => {
    if (/^\/(?![\/\\])[^\u0000-\u0020]*$/.test(value)) return true;
    try {
        const url = new URL(value);
        return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
    } catch {
        return false;
    }
});

export const profileRepositorySchema = z.object({
    sourceId: documentIdSchema,
    fullName: z.string().regex(/^[a-z0-9][a-z0-9-]*\/[a-z0-9._-]+$/i).max(200),
    url: z.string().url().max(300),
    description: z.string().max(2000),
    owner: z.string().regex(/^[a-z0-9][a-z0-9-]*$/i).max(100),
    ownerType: z.enum(["User", "Organization"]),
    language: z.string().max(100).nullable(),
    reason: plainText(200),
}).strict().refine((repository) => {
    return repository.url === `https://github.com/${repository.fullName}`
        && repository.fullName.split("/")[0] === repository.owner;
});

export const profileChatAnswerSchema = z.object({
    answer: plainText(1200),
    sources: z.array(z.object({
        id: documentIdSchema,
        title: z.string().min(1).max(200),
        url: sourceUrlSchema,
    }).strict()).max(6),
    cards: z.array(z.object({
        id: cardIdSchema,
        type: z.enum(["profile", "research", "project"]),
    }).strict()
        .refine((card) => profileCardRegistry[card.id].type === card.type)
        .transform((card) => profileCardRegistry[card.id])).max(4),
    blocks: z.array(profileAnswerBlockSchema).max(2),
    followUps: z.array(profileFollowUpSchema).max(4),
    repositories: z.array(profileRepositorySchema).max(3),
}).strict().refine((answer) => {
    const sources = new Set(answer.sources.map(({ id }) => id));
    return answer.blocks.every((block) => block.sourceIds.every((id) => sources.has(id)))
        && answer.repositories.every(({ sourceId }) => sources.has(sourceId));
});
