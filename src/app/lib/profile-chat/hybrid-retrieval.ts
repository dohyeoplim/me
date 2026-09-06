import { cosineSimilarity, embeddingHash, embedTexts } from "../knowledge/embeddings";
import { embeddingModel } from "../knowledge/embedding-schema";
import type { ProfileDocument } from "./documents";
import { retrieveDocuments } from "./retrieval";
import type { ChatMessage } from "./validation";

export function fuseRankings(lexical: ProfileDocument[], semantic: ProfileDocument[], contextSourceIds: string[] = []) {
    const candidates = new Map<string, { document: ProfileDocument; score: number }>();
    for (const ranking of [lexical, semantic]) ranking.forEach((document, index) => {
        const previous = candidates.get(document.id);
        candidates.set(document.id, { document, score: (previous?.score ?? 0) + 1 / (60 + index + 1) });
    });
    const pinned = new Set(contextSourceIds.slice(0, 2));
    let repositories = 0;
    return [...candidates.values()].sort((a, b) =>
        Number(pinned.has(b.document.id)) - Number(pinned.has(a.document.id)) || b.score - a.score,
    ).filter(({ document }) => !document.repository || ++repositories <= 3).slice(0, 6).map(({ document }) => document);
}

export async function retrieveHybridDocuments(
    question: string, history: ChatMessage[], documents: ProfileDocument[], contextSourceIds: string[],
    signal?: AbortSignal,
) {
    const lexical = retrieveDocuments(question, history, documents, contextSourceIds, false);
    const fallback = () => lexical.length ? lexical : retrieveDocuments(question, history, documents, contextSourceIds);
    const indexed = documents.filter((document) => document.embedding?.model === embeddingModel &&
        document.embedding.hash === embeddingHash(document));
    if (!indexed.length) return fallback();
    try {
        const querySignal = AbortSignal.any([AbortSignal.timeout(2500), ...(signal ? [signal] : [])]);
        const [query] = await embedTexts([question], querySignal);
        if (!query) return fallback();
        const semantic = indexed.map((document) => ({
            document, score: cosineSimilarity(query, document.embedding!.vector),
        })).filter(({ score }) => score >= 0.25).sort((a, b) => b.score - a.score).slice(0, 12);
        if (!semantic.length) return fallback();
        return fuseRankings(lexical, semantic.map(({ document }) => document), contextSourceIds);
    } catch {
        if (signal?.aborted) throw signal.reason;
        console.info({ event: "profile_chat_embedding_fallback" });
        return fallback();
    }
}
