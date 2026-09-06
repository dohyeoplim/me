import { createPortfolioSources } from "./sources";
import type { KnowledgeSource } from "./schema";

const contentFields = ["title", "text", "url", "keywords", "kind"] as const;

export function planPortfolioSync(existing: KnowledgeSource[], ids: string[]) {
    const canonical = new Map(createPortfolioSources().map((source) => [source.id, source]));
    const current = new Map(existing.map((source) => [source.id, source]));
    if (!ids.length || new Set(ids).size !== ids.length || ids.some((id) => !canonical.has(id))) {
        throw new Error("Provide distinct portfolio source IDs.");
    }
    const updates: Array<{ source: KnowledgeSource; fields: Array<typeof contentFields[number]> }> = [];
    const skipped: Array<{ id: string; reason: "missing" | "excluded" | "custom" | "unchanged" }> = [];
    for (const id of ids) {
        const previous = current.get(id);
        const source = canonical.get(id)!;
        const reason = !previous ? "missing" : previous.status !== "published" ? "excluded"
            : previous.origin !== "portfolio" || previous.repository ? "custom" : null;
        if (reason || !previous) {
            skipped.push({ id, reason: reason ?? "missing" });
            continue;
        }
        const fields = contentFields.filter((field) =>
            JSON.stringify(previous[field]) !== JSON.stringify(source[field]));
        if (!fields.length) {
            skipped.push({ id, reason: "unchanged" });
            continue;
        }
        updates.push({ source: {
            ...previous, title: source.title, text: source.text, url: source.url, keywords: [...source.keywords],
            kind: source.kind,
        }, fields });
    }
    return { updates, skipped };
}
