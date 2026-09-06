import assert from "node:assert/strict";
import test from "node:test";
import { exportKnowledgeCsv, parseKnowledgeCsv } from "./csv";
import { embeddingChunks, embeddingHash, embedSource, cosineSimilarity } from "./embeddings";
import { embeddingDimensions, embeddingModel } from "./embedding-schema";
import { createPortfolioSources, effectivePublishedSource } from "./sources";
import { parseRepositoryUrl } from "./github";
import { retrieveHybridDocuments, fuseRankings } from "../profile-chat/hybrid-retrieval";
import type { ProfileDocument } from "../profile-chat/documents";

const source = createPortfolioSources()[0]!;
const vector = (axis: number) => Array.from({ length: embeddingDimensions }, (_, index) => Number(index === axis));

test("CSV preserves commas, quotes, multiline text and formula-like values", () => {
    for (const title of ["Normal, title", 'A "quoted" title', "=SUM(A1)", "'=SUM(A1)", "+note", "@name"]) {
        const row = { ...source, title, text: "First line\nSecond, line", keywords: ["a,b", "한글"] };
        const [parsed] = parseKnowledgeCsv(exportKnowledgeCsv([row]));
        assert.equal(parsed?.title, title);
        assert.equal(parsed?.text, row.text);
        assert.deepEqual(parsed?.keywords, row.keywords);
    }
});

test("CSV rejects duplicate IDs, wrong columns and broken quotes", () => {
    assert.throws(() => parseKnowledgeCsv(exportKnowledgeCsv([source, source])));
    assert.throws(() => parseKnowledgeCsv('id,title\n"broken'));
    assert.throws(() => parseKnowledgeCsv("title,text\nHello,World"));
});

test("CSV carries reserved component presentation", () => {
    const cardPresentation = {
        enabled: true, title: "Profile", description: "Research", body: "Public profile details.",
    };
    const [parsed] = parseKnowledgeCsv(exportKnowledgeCsv([{ ...source, cardPresentation }]));
    assert.deepEqual(parsed?.cardPresentation, cardPresentation);
    const disabled = effectivePublishedSource({ ...source, cardPresentation: { ...cardPresentation, enabled: false } });
    assert.equal(disabled.cardId, null);
    assert.ok(effectivePublishedSource({ ...source, cardPresentation }).text.includes(cardPresentation.body));
});

test("embedding chunks preserve Unicode and respect byte limits", () => {
    const text = "한글🙂 document ".repeat(3000);
    const chunks = embeddingChunks(text);
    assert.equal(chunks.join(""), text);
    assert.ok(chunks.every((chunk) => Buffer.byteLength(chunk) <= 6000));
    assert.notEqual(embeddingHash(source), embeddingHash({ ...source, text: "Changed" }));
});

test("cosine and reciprocal rank fusion preserve relevant documents", () => {
    assert.equal(cosineSimilarity(vector(0), vector(0)), 1);
    assert.equal(cosineSimilarity(vector(0), vector(1)), 0);
    assert.equal(cosineSimilarity([], []), 0);
    const a = { ...source, id: "a", cardId: null, repository: undefined };
    const b = { ...a, id: "b" };
    assert.equal(fuseRankings([a, b], [b])[0]?.id, "b");
});

test("manual repository URLs reject external hosts and file paths", () => {
    assert.deepEqual(parseRepositoryUrl("https://github.com/DocFusionX/server"), {
        owner: "DocFusionX", name: "server",
    });
    for (const url of ["http://github.com/a/b", "https://github.com.evil.test/a/b", "https://github.com/a/b/tree/main",
        "https://user:pass@github.com/a/b", "https://github.com/a/b?token=x", "https://127.0.0.1/a/b"]) {
        assert.throws(() => parseRepositoryUrl(url));
    }
});

test("hybrid retrieval finds semantic-only matches and falls back on embedding failures", async () => {
    const fetchBefore = globalThis.fetch, keyBefore = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "test-key";
    const target: ProfileDocument = {
        ...source, id: "target", cardId: null, repository: undefined,
        title: "Acoustics", text: "Sound models", keywords: [],
    };
    target.embedding = { model: embeddingModel, hash: embeddingHash(target), vector: vector(0) };
    try {
        globalThis.fetch = async () => Response.json({ data: [{ index: 0, embedding: vector(0) }] });
        const selected = await retrieveHybridDocuments("말소리 분석", [], [target], []);
        assert.equal(selected[0]?.id, "target");
        const embedded = await embedSource(target);
        assert.equal(embedded.vector.length, embeddingDimensions);
        assert.equal(embedded.hash, embeddingHash(target));
        globalThis.fetch = async () => { throw new Error("Offline"); };
        assert.equal((await retrieveHybridDocuments("Acoustics", [], [target], []))[0]?.id, "target");
        let calls = 0;
        globalThis.fetch = async () => { calls++; throw new Error("Must not embed a stale source"); };
        await retrieveHybridDocuments("Acoustics", [], [{ ...target, text: "Updated content" }], []);
        assert.equal(calls, 0);
    } finally {
        globalThis.fetch = fetchBefore;
        if (keyBefore === undefined) delete process.env.OPENAI_API_KEY;
        else process.env.OPENAI_API_KEY = keyBefore;
    }
});
