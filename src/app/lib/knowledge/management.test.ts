import assert from "node:assert/strict";
import test from "node:test";
import { exportKnowledgeCsv, parseKnowledgeCsv } from "./csv";
import { embeddingChunks, embeddingHash, embedSource, cosineSimilarity } from "./embeddings";
import { embeddingDimensions, embeddingModel } from "./embedding-schema";
import { createPortfolioSources, effectivePublishedSource } from "./sources";
import { parseRepositoryUrl } from "./github";
import { retrieveHybridDocuments, fuseRankings } from "../profile-chat/hybrid-retrieval";
import type { ProfileDocument } from "../profile-chat/documents";
import { curatePortfolioSources, portfolioRepositories } from "./curation";
import { repositoryKnowledgeSource } from "./github-content";
import { defaultReservedComponents } from "../reserved-components/schema";
import { selectSourceRange } from "./selection";
import { componentDefaults } from "../reserved-components/defaults";

const source = createPortfolioSources()[0]!;
const vector = (axis: number) => Array.from({ length: embeddingDimensions }, (_, index) => Number(index === axis));

test("reserved component defaults use the full school name and omit E-ACT performance figures", () => {
    assert.ok(componentDefaults("docfusionx").body.includes("Technische Hochschule Ulm"));
    assert.ok(!componentDefaults("eact").body.includes("12.3"));
    assert.ok(!componentDefaults("eact").body.includes("percentage points"));
});

test("portfolio curation keeps primary repositories and excludes unrelated material without deleting it", () => {
    const repositories = portfolioRepositories.map(({ name, description }) => repositoryKnowledgeSource({
        fullName: name, url: `https://github.com/${name}`, description, owner: name.split("/")[0]!,
        ownerType: "Organization", language: null, topics: [], archived: false, fork: false,
    }, "Repository information."));
    const unrelated = { ...source, id: "classroom-notes", title: "Classroom exercise" };
    const existing = [...createPortfolioSources(), ...repositories, unrelated];
    const result = curatePortfolioSources(existing);
    assert.equal(result.published.length, 26);
    assert.deepEqual(result.excluded.map(({ id }) => id), [unrelated.id]);
    assert.equal(existing.at(-1)?.status, "published");
    assert.equal(result.published.find(({ id }) => id === "drivernet")?.kind, "project");
    assert.ok(result.published.find(({ id }) => id === "drivernet")?.text.includes("March to July 2025"));
    assert.ok(!/InfiniBand|\bMIG\b|bastion/.test(result.published.find(({ id }) => id === "infrastructure")?.text ?? ""));
    assert.ok(result.published.some(({ id }) => id === "personal-website"));
});

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

test("reserved components are independent of source CSV and can be disabled separately", () => {
    const cardPresentation = {
        enabled: true, title: "Profile", description: "Research", body: "Public profile details.",
    };
    const [parsed] = parseKnowledgeCsv(exportKnowledgeCsv([source]));
    assert.equal("cardPresentation" in parsed!, false);
    const components = defaultReservedComponents.map((component) => ({ ...component, presentation: cardPresentation }));
    const disabled = effectivePublishedSource(source, components.map((component) => ({ ...component, enabled: false })));
    assert.equal(disabled.cardId, null);
    assert.ok(effectivePublishedSource(source, components).text.includes(cardPresentation.body));
});

test("range selection is inclusive, reversible and preserves unrelated selections", () => {
    const ordered = ["a", "b", "c", "d", "e"];
    assert.deepEqual(selectSourceRange(ordered, ["a", "e"], "a", "c", true), ["a", "e", "b", "c"]);
    assert.deepEqual(selectSourceRange(ordered, [], "d", "b", true), ["b", "c", "d"]);
    assert.deepEqual(selectSourceRange(ordered, ordered, "a", "c", false), ["d", "e"]);
    assert.deepEqual(selectSourceRange(ordered, [], "missing", "b", true), ["b"]);
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
