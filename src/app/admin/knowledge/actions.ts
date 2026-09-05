"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
    archiveKnowledgeSource,
    getKnowledgeSource,
    saveKnowledgeSource,
} from "@/app/lib/knowledge/repository";
import { syncGitHubKnowledge, type GitHubSyncReport } from "@/app/lib/knowledge/github";
import { KnowledgeEditSchema, type KnowledgeSource } from "@/app/lib/knowledge/schema";

type ActionResult<T> = { ok: true; value: T } | { ok: false; error: string };

async function requireAdmin() {
    const session = await auth();
    if (!session?.user || !process.env.ADMIN_GITHUB_LOGIN) throw new Error("Unauthorized");
}

function refreshKnowledge() {
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
        });
        refreshKnowledge();
        return { ok: true, value: source };
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

export async function syncGitHubAction(): Promise<ActionResult<GitHubSyncReport>> {
    await requireAdmin();
    try {
        const report = await syncGitHubKnowledge();
        refreshKnowledge();
        return { ok: true, value: report };
    } catch {
        return { ok: false, error: "GitHub refresh did not finish. Existing sources are preserved. Try again." };
    }
}
