import { createHash } from "node:crypto";
import { z } from "../schema";
import { embeddingDimensions, embeddingModel, type SourceEmbedding } from "./embedding-schema";

type EmbeddableSource = { title: string; text: string; kind?: string; keywords: string[] };

export function embeddingText(source: EmbeddableSource) {
    return [source.title, source.kind ?? "", source.keywords.join(", "), source.text].join("\n");
}

export function embeddingHash(source: EmbeddableSource) {
    const content = `${embeddingModel}:${embeddingDimensions}\n${embeddingText(source)}`;
    return createHash("sha256").update(content).digest("hex");
}

export function embeddingChunks(text: string, maximumBytes = 6000) {
    const chunks: string[] = [];
    let chunk = "";
    let bytes = 0;
    for (const character of text) {
        const length = Buffer.byteLength(character);
        if (bytes + length > maximumBytes && chunk) {
            chunks.push(chunk);
            chunk = "";
            bytes = 0;
        }
        chunk += character;
        bytes += length;
    }
    if (chunk.trim()) chunks.push(chunk);
    return chunks;
}

export async function embedTexts(inputs: string[], signal?: AbortSignal): Promise<number[][]> {
    if (!inputs.length || inputs.length > 32 || inputs.some((text) => !text.trim() || Buffer.byteLength(text) > 6000)) {
        throw new Error("Invalid embedding input.");
    }
    if (!process.env.OPENAI_API_KEY) throw new Error("Embeddings are not configured.");
    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: embeddingModel, dimensions: embeddingDimensions, input: inputs }),
        signal: AbortSignal.any([AbortSignal.timeout(8000), ...(signal ? [signal] : [])]),
        cache: "no-store", redirect: "error",
    });
    if (!response.ok) throw new Error("Embedding request failed.");
    const result = z.object({ data: z.array(z.object({
        index: z.number().int().min(0),
        embedding: z.array(z.number().finite()).length(embeddingDimensions),
    })).length(inputs.length) }).parse(await response.json());
    const sorted = [...result.data].sort((a, b) => a.index - b.index);
    if (sorted.some(({ index }, position) => index !== position)) throw new Error("Invalid embedding order.");
    return sorted.map(({ embedding }) => embedding);
}

export async function embedSource(source: EmbeddableSource, signal?: AbortSignal): Promise<SourceEmbedding> {
    const chunks = embeddingChunks(embeddingText(source));
    const vectors = await embedTexts(chunks, signal);
    const vector = Array.from({ length: embeddingDimensions }, (_, index) =>
        vectors.reduce((sum, item, position) => sum + (item[index] ?? 0) * (chunks[position]?.length ?? 0), 0),
    );
    const norm = Math.hypot(...vector);
    if (!norm) throw new Error("Empty embedding vector.");
    return { model: embeddingModel, hash: embeddingHash(source), vector: vector.map((value) => value / norm) };
}

export function cosineSimilarity(first: number[], second: number[]) {
    if (!first.length || first.length !== second.length) return 0;
    const denominator = Math.hypot(...first) * Math.hypot(...second);
    if (!denominator) return 0;
    return first.reduce((sum, value, index) => sum + value * (second[index] ?? 0), 0) / denominator;
}
