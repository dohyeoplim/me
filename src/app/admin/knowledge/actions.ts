"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/app/lib/admin-session";
import {
    archiveKnowledgeSource,
    getKnowledgeSource,
    saveKnowledgeSource,
    listKnowledgeSources, saveKnowledgeEmbedding, setKnowledgeVisibility, saveKnowledgeSources,
} from "@/app/lib/knowledge/repository";
import { importGitHubRepository } from "@/app/lib/knowledge/github";
import { KnowledgeEditSchema, type KnowledgeSource } from "@/app/lib/knowledge/schema";
import { embedSource, embeddingHash } from "@/app/lib/knowledge/embeddings";
import { effectivePublishedSource } from "@/app/lib/knowledge/sources";
import { parseKnowledgeCsv } from "@/app/lib/knowledge/csv";
import { z } from "@/app/lib/schema";

type ActionResult<T> = { ok: true; value: T; warning?: string } | { ok: false; error: string };

function refreshKnowledge() {
    updateTag("profile-knowledge");
    revalidatePath("/admin/knowledge");
    revalidatePath("/");
}

export async function saveKnowledgeAction(input: unknown, create = false): Promise<ActionResult<KnowledgeSource>> {
    await requireAdmin();
    const result = KnowledgeEditSchema.safeParse(input);
    if (!result.success) return { ok: false, error: result.error.issues[0]?.message ?? "Check the source fields." };
    try {
        const existing = create ? null : await getKnowledgeSource(result.data.id);
        if (!create && !existing) return { ok: false, error: "This source could not be found. Refresh and try again." };
        const source = await saveKnowledgeSource({
            ...existing,
            ...result.data,
            id: create ? `note-${crypto.randomUUID()}` : result.data.id,
            origin: existing?.origin ?? "manual",
            cardId: existing?.cardId ?? null,
            cardPresentation: result.data.cardPresentation,
        });
        let warning: string | undefined;
        const effective = effectivePublishedSource(source);
        if (source.status === "published" && source.embedding?.hash !== embeddingHash(effective)) {
            try { await saveKnowledgeEmbedding(source, await embedSource(effective)); }
            catch { warning = "Saved. Search indexing is pending. Use Build search index to retry."; }
        }
        refreshKnowledge();
        return { ok: true, value: { ...source, embedding: undefined }, warning };
    } catch {
        return { ok: false, error: "Changes could not be saved. Your edits are still here. Try again." };
    }
}

export async function archiveKnowledgeAction(id: string): Promise<ActionResult<null>> {
    await requireAdmin();
    try {
        await archiveKnowledgeSource(id);
        refreshKnowledge();
        return { ok: true, value: null };
    } catch {
        return { ok: false, error: "This source could not be unpublished. Try again." };
    }
}

export async function addRepositoryAction(url: string): Promise<ActionResult<string>> {
    await requireAdmin();
    try {
        if (typeof url !== "string" || url.length > 2000) throw new Error("Invalid URL.");
        const source = await importGitHubRepository(url);
        const existing = await getKnowledgeSource(source.id);
        if (!existing) await saveKnowledgeSource(source);
        refreshKnowledge();
        return { ok: true, value: source.id };
    } catch {
        return { ok: false, error: "Use a public GitHub repository URL. Existing sources were preserved." };
    }
}

export async function setSourcesVisibilityAction(input: unknown): Promise<ActionResult<number>> {
    await requireAdmin();
    const parsed = z.object({ ids: z.array(z.string().min(1).max(120)).min(1).max(500),
        status: z.enum(["draft", "published"]) }).safeParse(input);
    if (!parsed.success) return { ok: false, error: "Select sources and a valid visibility." };
    try {
        await setKnowledgeVisibility(parsed.data.ids, parsed.data.status);
        refreshKnowledge();
        return { ok: true, value: parsed.data.ids.length };
    } catch { return { ok: false, error: "Visibility could not be updated." }; }
}

export async function importKnowledgeCsvAction(form: FormData): Promise<ActionResult<number>> {
    await requireAdmin();
    try {
        const file = form.get("csv");
        if (!(file instanceof File) || file.size > 4_000_000) throw new Error("Invalid CSV.");
        const rows = parseKnowledgeCsv(await file.text());
        const existing = new Map((await listKnowledgeSources(true)).map((source) => [source.id, source]));
        const sources = rows.map((row): KnowledgeSource => {
            const previous = existing.get(row.id);
            if (!previous && !row.id.startsWith("new-")) throw new Error("Unknown source ID. Leave new IDs empty.");
            if (row.cardPresentation && !previous?.cardId) throw new Error("This source has no reserved card.");
            return { ...previous, ...row, cardPresentation: row.cardPresentation,
                id: previous?.id ?? `note-${crypto.randomUUID()}`,
                origin: previous?.origin ?? "manual", cardId: previous?.cardId ?? null };
        });
        await saveKnowledgeSources(sources);
        refreshKnowledge();
        return { ok: true, value: sources.length };
    } catch {
        return { ok: false, error: "Import did not finish. Refresh to check saved sources before retrying." };
    }
}

type IndexReport = { indexed: number; failed: number; remaining: number };

export async function buildSearchIndexAction(): Promise<ActionResult<IndexReport>> {
    await requireAdmin();
    try {
        const sources = (await listKnowledgeSources(true)).filter((source) => source.status === "published" &&
            source.embedding?.hash !== embeddingHash(effectivePublishedSource(source)));
        const results = await Promise.all(sources.slice(0, 5).map(async (source) => {
            try {
                await saveKnowledgeEmbedding(source, await embedSource(effectivePublishedSource(source)));
                return true;
            }
            catch { return false; }
        }));
        refreshKnowledge();
        const indexed = results.filter(Boolean).length;
        return { ok: true, value: { indexed, failed: results.length - indexed, remaining: sources.length - indexed } };
    } catch { return { ok: false, error: "Search index could not be updated." }; }
}
