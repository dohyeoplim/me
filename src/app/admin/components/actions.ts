"use server";

import { updateTag, revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/lib/admin-session";
import { ReservedComponentSchema } from "@/app/lib/reserved-components/schema";
import { listReservedComponents, saveReservedComponent } from "@/app/lib/reserved-components/repository";
import { listKnowledgeSources, saveKnowledgeEmbedding } from "@/app/lib/knowledge/repository";
import { effectivePublishedSource } from "@/app/lib/knowledge/sources";
import { embedSource, embeddingHash } from "@/app/lib/knowledge/embeddings";

export async function saveComponentAction(input: unknown) {
    await requireAdmin();
    const parsed = ReservedComponentSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the component fields." };
    try {
        const sources = await listKnowledgeSources(true);
        const components = await listReservedComponents();
        const ids = new Set(sources.map(({ id }) => id));
        if (parsed.data.sourceIds.some((id) => !ids.has(id))) {
            return { ok: false as const, error: "An evidence source no longer exists." };
        }
        const taken = components.filter((item) => item.id !== parsed.data.id && item.enabled)
            .flatMap((item) => item.sourceIds);
        if (parsed.data.enabled && parsed.data.sourceIds.some((id) => taken.includes(id))) {
            return { ok: false as const, error: "An evidence source is already assigned to another component." };
        }
        const saved = await saveReservedComponent({ ...parsed.data, sourceIds: [...new Set(parsed.data.sourceIds)] });
        updateTag("reserved-components"); updateTag("profile-knowledge");
        const next = components.map((item) => item.id === saved.id ? saved : item);
        const previousIds = components.find((item) => item.id === saved.id)?.sourceIds ?? [];
        const affected = new Set([...saved.sourceIds, ...previousIds]);
        const published = sources.filter((source) => affected.has(source.id) && source.status === "published" &&
            source.embedding?.hash !== embeddingHash(effectivePublishedSource(source, next)));
        const results = await Promise.all(published.map(async (source) => {
                try {
                    await saveKnowledgeEmbedding(source, await embedSource(effectivePublishedSource(source, next)));
                    return true;
                }
                catch { return false; }
            }));
        updateTag("profile-knowledge"); revalidatePath("/admin/components"); revalidatePath("/admin/knowledge");
        return { ok: true as const, value: saved, warning: results.some((result) => !result)
            ? "Saved. Rebuild the search index to finish updating evidence." : undefined };
    } catch { return { ok: false as const, error: "The component could not be saved. Refresh before retrying." }; }
}
