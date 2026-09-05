import assert from "node:assert/strict";
import test from "node:test";
import { includeRepository, plainReadme, repositoryKnowledgeSource, repositorySourceId } from "./github-content";
import { isPublicSourceUrl, KnowledgeEditSchema, type RepositoryMetadata } from "./schema";
import { createPortfolioSources, effectivePublishedSource } from "./sources";

const repository: RepositoryMetadata = {
    fullName: "Collog-App/server",
    url: "https://github.com/Collog-App/server",
    description: "Family call health records",
    owner: "Collog-App",
    ownerType: "Organization",
    language: "Python",
    topics: ["speech", "health"],
    archived: false,
    fork: false,
};

test("source URLs allow site paths and public web links without executable protocols", () => {
    for (const value of ["/portfolio#research", "https://github.com/Collog-App", "http://cv.dohyeoplim.me/"]) {
        assert.equal(isPublicSourceUrl(value), true);
    }
    for (const value of ["javascript:alert(1)", "data:text/html,hello", "//example.com", "/\\example.com", "/\n/a"]) {
        assert.equal(isPublicSourceUrl(value), false);
    }
});

test("source edits cannot replace managed repository metadata or origin", () => {
    const source = repositoryKnowledgeSource(repository, "A public README.");
    const edit = KnowledgeEditSchema.parse({ ...source, origin: "manual", repository: {} });
    assert.equal("origin" in edit, false);
    assert.equal("repository" in edit, false);
    assert.equal("cardId" in edit, false);
});

test("edited portfolio facts disable the static card", () => {
    const source = createPortfolioSources().find(({ id }) => id === "collog")!;
    assert.equal(effectivePublishedSource(source).cardId, "collog");
    assert.equal(effectivePublishedSource({ ...source, text: "Updated owner notes." }).cardId, null);
});

test("removed and inherited card names never become specialized cards", () => {
    const source = createPortfolioSources().find(({ id }) => id === "education")!;
    assert.equal(effectivePublishedSource({ ...source, cardId: "education" }).cardId, null);
    assert.equal(effectivePublishedSource({ ...source, cardId: "constructor" }).cardId, null);
});

test("repository IDs are stable, distinct, and valid source identifiers", () => {
    assert.equal(repositorySourceId("Collog-App/server"), repositorySourceId("collog-app/SERVER"));
    assert.notEqual(repositorySourceId("my-org/app"), repositorySourceId("my/org-app"));
    assert.match(repositorySourceId(repository.fullName), /^[a-z0-9][a-z0-9._-]{0,119}$/);
});

test("forked mirrors are skipped unless already named as a core project", () => {
    assert.equal(includeRepository({ fullName: "dohyeoplim/react", fork: true }), false);
    assert.equal(includeRepository({ fullName: "DocFusionX/server", fork: true }), true);
    assert.equal(includeRepository(repository), true);
});

test("README excerpts discard code and HTML and have a fixed maximum length", () => {
    const markdown = "# Project\n```sh\nunsafe code\n```\n<script>hidden</script>\n[Overview](https://example.com)";
    assert.equal(plainReadme(markdown), "Project\n\nOverview");
    assert.equal(plainReadme("a".repeat(10_000)).length, 6_000);
});

test("organization sources distinguish repository information from personal contributions", () => {
    const source = repositoryKnowledgeSource(repository, "README detail.");
    assert.equal(source.origin, "github");
    assert.equal(source.status, "published");
    assert.equal(source.cardId, null);
    assert.match(source.text, /membership alone does not establish/);
    assert.match(source.text, /README detail/);
    assert.ok(source.keywords.includes("Python"));
});
