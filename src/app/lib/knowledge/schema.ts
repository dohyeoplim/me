import { z } from "zod";

export function isPublicSourceUrl(value: string) {
    if (/^\/(?![\/\\])[^\u0000-\u0020]*$/.test(value)) return true;
    try {
        const url = new URL(value);
        return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
    } catch {
        return false;
    }
}

const SourceUrlSchema = z.string().trim().max(2_000).refine(isPublicSourceUrl, "Use a page path or public URL.");

export const RepositorySchema = z.object({
    fullName: z.string().min(1).max(200),
    url: SourceUrlSchema,
    description: z.string().max(2_000),
    owner: z.string().min(1).max(100),
    ownerType: z.enum(["User", "Organization"]),
    language: z.string().max(100).nullable(),
    topics: z.array(z.string().max(100)).max(50),
    archived: z.boolean(),
    fork: z.boolean(),
});

export const KnowledgeSourceSchema = z.object({
    id: z.string().regex(/^[a-z0-9][a-z0-9._-]{0,119}$/),
    title: z.string().trim().min(1).max(200),
    text: z.string().trim().min(1).max(24_000),
    url: SourceUrlSchema,
    keywords: z.array(z.string().trim().min(1).max(100)).max(50),
    kind: z.enum(["profile", "research", "project", "education", "experience", "repository"]),
    status: z.enum(["published", "draft"]),
    cardId: z.string().nullable(),
    origin: z.enum(["portfolio", "manual", "github"]),
    repository: RepositorySchema.optional(),
});

export const KnowledgeEditSchema = KnowledgeSourceSchema.pick({
    id: true,
    title: true,
    text: true,
    url: true,
    keywords: true,
    kind: true,
    status: true,
});

export type KnowledgeSource = z.infer<typeof KnowledgeSourceSchema>;
export type KnowledgeEdit = z.infer<typeof KnowledgeEditSchema>;
export type RepositoryMetadata = z.infer<typeof RepositorySchema>;
