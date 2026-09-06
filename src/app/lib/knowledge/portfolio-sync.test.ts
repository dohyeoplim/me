import assert from "node:assert/strict";
import test from "node:test";
import { planPortfolioSync } from "./portfolio-sync";
import { createPortfolioSources } from "./sources";
import { embeddingDimensions, embeddingModel, type SourceEmbedding } from "./embedding-schema";

const canonical = createPortfolioSources();
const source = canonical.find(({ id }) => id === "community")!;

test("portfolio sync requires explicit distinct canonical IDs", () => {
    for (const ids of [[], [source.id, source.id], ["github-example"], ["missing"]]) {
        assert.throws(() => planPortfolioSync(canonical, ids), /distinct portfolio source IDs/);
    }
});

test("portfolio sync only updates requested published portfolio content", () => {
    const previous = { ...source, text: "Previous community details.", title: "Earlier title" };
    const unselected = { ...canonical.find(({ id }) => id === "skills")!, text: "Custom skills details." };
    const existing = [previous, unselected];
    const { updates, skipped } = planPortfolioSync(existing, [source.id]);
    assert.equal(updates.length, 1);
    assert.deepEqual(updates[0]?.fields, ["title", "text"]);
    assert.equal(updates[0]?.source.text, source.text);
    assert.equal(updates[0]?.source.status, previous.status);
    assert.equal(updates[0]?.source.origin, previous.origin);
    assert.deepEqual(skipped, []);
    assert.equal(previous.text, "Previous community details.");
    assert.equal(unselected.text, "Custom skills details.");
});

test("portfolio sync leaves excluded, manual, missing and unchanged records alone", () => {
    const draft = { ...source, status: "draft" as const, text: "Excluded content." };
    assert.deepEqual(planPortfolioSync([draft], [source.id]).skipped, [{ id: source.id, reason: "excluded" }]);
    const manual = { ...source, origin: "manual" as const, text: "Edited manually." };
    assert.deepEqual(planPortfolioSync([manual], [source.id]).skipped, [{ id: source.id, reason: "custom" }]);
    assert.deepEqual(planPortfolioSync([], [source.id]).skipped, [{ id: source.id, reason: "missing" }]);
    assert.deepEqual(planPortfolioSync([source], [source.id]).skipped, [{ id: source.id, reason: "unchanged" }]);
});

test("portfolio sync retains the old embedding until a replacement is generated", () => {
    const embedding: SourceEmbedding = {
        hash: "a".repeat(64), model: embeddingModel, vector: Array(embeddingDimensions).fill(0),
    };
    const previous = { ...source, text: "Previous content.", embedding };
    const { updates } = planPortfolioSync([previous], [source.id]);
    assert.equal(updates[0]?.source.embedding, embedding);
});

test("portfolio notes include current R&D support and the confirmed DriverNet contribution", () => {
    const infrastructure = canonical.find(({ id }) => id === "infrastructure")!;
    assert.match(infrastructure.text, /education-focused.*vision-language-action/);
    assert.match(infrastructure.text, /GPU resource allocation.*Docker/);
    assert.doesNotMatch(infrastructure.text, /InfiniBand|\bMIG\b|bastion/);
    const driverNet = canonical.find(({ id }) => id === "drivernet")!;
    assert.match(driverNet.text, /Developed depth-map-based gated projection/);
    assert.match(driverNet.text, /Implemented the EMA teacher training pipeline/);
});
