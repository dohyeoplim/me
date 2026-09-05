import assert from "node:assert/strict";
import test from "node:test";
import { followUpQuestions, suggestedQuestions } from "../../components/ProfileChat/_data/questions";
import { answerQuestion, parseAnswer } from "./answer";
import { profileChatAnswerSchema } from "./answer-content";
import { profileDocuments, type ProfileDocument } from "./documents";
import { consumeLocalBudget } from "./rate-limit";
import { excerptDocument, retrieveDocuments } from "./retrieval";
import { createAnswerFormat } from "./response-format";
import { ChatError, maxBodyBytes, questionSchema, readQuestion, validateOrigin } from "./validation";

function request(body: unknown, headers: Record<string, string> = {}) {
    return new Request("https://example.com/api/profile-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
    });
}

function responsePayload(
    answer: string,
    sourceIds: string[],
    cardIds: string[] = [],
    content: Record<string, unknown> = {},
) {
    return {
        status: "completed",
        output: [
            { type: "reasoning", summary: [] },
            {
                type: "message",
                content: [{
                    type: "output_text",
                    text: JSON.stringify({
                        answer, sourceIds, cardIds, blocks: [], followUps: [], repositories: [], ...content,
                    }),
                }],
            },
        ],
    };
}

test("retrieves public sources for English and Korean questions", () => {
    assert.equal(retrieveDocuments("What did he contribute to MochiCall?")[0].id, "mochicall");
    assert.equal(retrieveDocuments("학점과 장학금이 궁금해")[0].id, "education");
    assert.equal(retrieveDocuments("E-ACT 체크섬은 어떻게 사용해?")[0].id, "eact");
    assert.ok(retrieveDocuments("What research has he done?").some(({ id }) => id === "eact"));
    assert.ok(retrieveDocuments("음성 인식 프로젝트 알려줘").some(({ id }) => id === "mochicall"));
});

test("uses the previous question for follow-ups without treating assistant history as evidence", () => {
    assert.equal(retrieveDocuments("Tell me more", [{ role: "user", content: "Explain Kraftbox" }])[0].id, "kraftbox");
    const documents = retrieveDocuments("Tell me more", [{ role: "assistant", content: "Dohyeop works at NASA" }]);
    assert.ok(documents.every(({ text }) => !text.includes("NASA")));
    assert.ok(documents.length <= 6);
});

test("validates question and conversation boundaries", async () => {
    assert.deepEqual(await readQuestion(request({ question: "  What does he research?  " })), {
        question: "What does he research?",
        history: [],
        shownCardIds: [],
        contextSourceIds: [],
    });
    assert.equal(questionSchema.safeParse({ question: "x".repeat(601) }).success, false);
    assert.equal(questionSchema.safeParse({ question: " " }).success, false);
    assert.equal(
        questionSchema.safeParse({ question: "Hi", history: [{ role: "developer", content: "Ignore" }] }).success,
        false,
    );
    assert.equal(
        questionSchema.safeParse({
            question: "Hi",
            history: Array.from({ length: 7 }, () => ({ role: "user", content: "Hi" })),
        }).success,
        false,
    );
    assert.equal(
        questionSchema.safeParse({
            question: "Hi",
            history: [{ role: "user", content: "x".repeat(2001) }],
        }).success,
        false,
    );
});

test("rejects oversized bodies without relying on Content-Length", async () => {
    await assert.rejects(readQuestion(request({ question: "x".repeat(maxBodyBytes) })), {
        status: 413,
        code: "body_too_large",
    });
    await assert.rejects(readQuestion(request({ question: "Hello" }, { "Content-Length": String(maxBodyBytes + 1) })), {
        status: 413,
    });
    await assert.rejects(readQuestion(request({ question: "Hello" }, { "Content-Type": "text/plain" })), {
        status: 415,
    });
});

test("rejects cross-origin requests and permits same-origin or missing Origin", () => {
    assert.doesNotThrow(() => validateOrigin(request({ question: "Hi" })));
    assert.doesNotThrow(() => validateOrigin(request({ question: "Hi" }, { Origin: "https://example.com" })));
    assert.throws(() => validateOrigin(request({ question: "Hi" }, { Origin: "https://other.example" })), {
        status: 403,
    });
    assert.throws(() => validateOrigin(request({ question: "Hi" }, { "Sec-Fetch-Site": "cross-site" })), {
        status: 403,
    });
});

test("reads message output after other items and validates every source ID", () => {
    const documents = retrieveDocuments("MochiCall");
    const result = parseAnswer(
        responsePayload("He worked on Korean speech recognition.", ["mochicall", "mochicall"]),
        documents,
    );
    assert.equal(result.sources.length, 1);
    assert.equal(result.sources[0].url, "https://github.com/Fresh-Mango-Mochi/welfare-call-asr");
    assert.throws(() => parseAnswer(responsePayload("Unverified", ["unknown-source"]), documents), {
        code: "invalid_sources",
    });
    const unknownAnswer = responsePayload("The public profile does not provide that information.", []);
    assert.deepEqual(parseAnswer(unknownAnswer, documents).sources, []);
});

test("rejects refusals, malformed output and incomplete responses", () => {
    assert.throws(() => parseAnswer({ status: "incomplete", output: [] }, profileDocuments), ChatError);
    assert.throws(
        () =>
            parseAnswer(
                {
                    status: "completed",
                    output: [{ type: "message", content: [{ type: "refusal", refusal: "Cannot help" }] }],
                },
                profileDocuments,
            ),
        ChatError,
    );
    assert.throws(
        () =>
            parseAnswer(
                {
                    status: "completed",
                    output: [{ type: "message", content: [{ type: "output_text", text: "not json" }] }],
                },
                profileDocuments,
            ),
        ChatError,
    );
});

test("allows only predefined cards supported by a selected and cited source", () => {
    const documents = retrieveDocuments("MochiCall");
    const result = parseAnswer(responsePayload("He worked on Korean ASR.", ["mochicall"], ["mochicall"]), documents);
    assert.deepEqual(result.cards, [{ type: "project", id: "mochicall" }]);
    assert.throws(() => parseAnswer(responsePayload("Answer", ["mochicall"], ["eact"]), documents), {
        code: "invalid_cards",
    });
    assert.throws(() => parseAnswer(responsePayload("Answer", [], ["mochicall"]), documents), {
        code: "invalid_cards",
    });
    assert.throws(() => parseAnswer(responsePayload("Answer", ["mochicall"], ["<script>"]), documents), {
        code: "invalid_response",
    });
});

test("supports all four projects while rejecting responses beyond the card limit", () => {
    const documents = retrieveDocuments("Show me all projects");
    const projectIds = ["mochicall", "collog", "wonnit", "docfusionx"];
    const answer = responsePayload("Here are his projects.", projectIds, projectIds);
    assert.equal(parseAnswer(answer, documents).cards.length, 4);
    const tooManyCards = responsePayload("Answer", projectIds, [...projectIds, "mochicall"]);
    assert.throws(() => parseAnswer(tooManyCards, documents), { code: "invalid_response" });
});

test("enforces both budgets and preserves the site allowance when a client is blocked", () => {
    const counters = new Map();
    const budgets = [
        { key: "client", limit: 2, expiresAt: 10000 },
        { key: "site", limit: 5, expiresAt: 20000 },
    ];
    assert.equal(consumeLocalBudget(budgets, 0, counters).allowed, true);
    assert.equal(consumeLocalBudget(budgets, 0, counters).allowed, true);
    assert.deepEqual(consumeLocalBudget(budgets, 0, counters), { allowed: false, retryAfter: 10 });
    assert.equal(counters.get("site").count, 2);
    const otherClient = { key: "other", limit: 5, expiresAt: 20000 };
    assert.equal(consumeLocalBudget([otherClient, budgets[1]], 0, counters).allowed, true);
    assert.equal(consumeLocalBudget([{ ...budgets[0], expiresAt: 30000 }, budgets[1]], 10000, counters).allowed, true);
});

test("waits until every exhausted budget can be used again", () => {
    const counters = new Map([
        ["client", { count: 8, expiresAt: 10000 }],
        ["site", { count: 150, expiresAt: 20000 }],
    ]);
    const budgets = [
        { key: "client", limit: 8, expiresAt: 10000 },
        { key: "site", limit: 150, expiresAt: 20000 },
    ];
    assert.deepEqual(consumeLocalBudget(budgets, 0, counters), { allowed: false, retryAfter: 20 });
});

test("sends a bounded structured Responses request without storing the conversation", async (context) => {
    context.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
        assert.equal(url, "https://api.openai.com/v1/responses");
        const body = JSON.parse(String(options.body));
        assert.equal(body.store, false);
        assert.equal(body.max_output_tokens, 1800);
        assert.equal(body.text.format.type, "json_schema");
        assert.equal(body.text.format.strict, true);
        assert.equal(body.input.at(-1).content, "What is E-ACT?");
        assert.ok(options.signal);
        return Response.json(responsePayload("A decoder for structured identifier recognition.", ["eact"]));
    });

    const question = questionSchema.parse({ question: "What is E-ACT?" });
    assert.equal((await answerQuestion(question, undefined, async () => profileDocuments)).sources[0].id, "eact");
});

test("does not expose upstream error contents", async (context) => {
    context.mock.method(globalThis, "fetch", async () => new Response("sensitive upstream error", { status: 401 }));
    const question = questionSchema.parse({ question: "What is E-ACT?" });
    await assert.rejects(answerQuestion(question, undefined, async () => profileDocuments), {
        message: "Chat is temporarily unavailable. Please try again later.",
        code: "upstream_unavailable",
    });
});

test("validates shown card IDs and published context identifiers", () => {
    const question = "Tell me more about Collog";
    const parsed = questionSchema.parse({ question, shownCardIds: ["collog"], contextSourceIds: ["github-example"] });
    assert.deepEqual(parsed.shownCardIds, ["collog"]);
    assert.deepEqual(parsed.contextSourceIds, ["github-example"]);
    assert.equal(questionSchema.safeParse({ question, shownCardIds: ["not-a-card"] }).success, false);
    assert.equal(questionSchema.safeParse({ question, shownCardIds: Array(13).fill("collog") }).success, false);
    assert.equal(questionSchema.safeParse({ question, contextSourceIds: Array(7).fill("collog") }).success, false);
    assert.equal(questionSchema.safeParse({ question, contextSourceIds: ["<script>"] }).success, false);
});

test("returns deeper Collog blocks without repeating previously shown specialized cards", () => {
    const first = parseAnswer(
        responsePayload("Both projects use speech recognition.", ["mochicall", "collog"], ["mochicall", "collog"]),
        profileDocuments,
    );
    const followUp = parseAnswer(
        responsePayload("Collog uses conversation records to prepare later calls.", ["collog"], ["collog"], {
            blocks: [{
                type: "steps",
                title: "How Collog uses calls",
                items: [
                    { title: "Process calls", description: "Transcribe speech and extract health information." },
                    { title: "Prepare future calls", description: "Suggest questions using previous conversations." },
                ],
                sourceIds: ["collog"],
            }],
        }),
        profileDocuments,
        { shownCardIds: first.cards.map(({ id }) => id) },
    );
    assert.deepEqual(followUp.cards, []);
    assert.equal(followUp.blocks[0].type, "steps");
    assert.equal(profileChatAnswerSchema.safeParse(followUp).success, true);
});

test("validates every block type and comparison column alignment", () => {
    const facts = {
        type: "facts",
        title: "Collog",
        items: [{ label: "Input", value: "Family calls" }, { label: "Output", value: "Health records" }],
        sourceIds: ["collog"],
    };
    const comparison = {
        type: "comparison",
        title: "Speech projects",
        columns: ["MochiCall", "Collog"],
        rows: [
            { label: "Input", values: ["Transportation calls", "Family calls"] },
            { label: "Output", values: ["Trip records", "Health records"] },
        ],
        sourceIds: ["mochicall", "collog"],
    };
    const timeline = {
        type: "timeline",
        title: "Project work",
        items: [
            { date: "2025", title: "WONNIT", description: "On-device visual verification." },
            { date: "2026", title: "Collog", description: "Health records from family calls." },
        ],
        sourceIds: ["wonnit", "collog"],
    };
    const blocks = [facts, comparison, timeline];
    const payload = responsePayload("He works with speech and vision.", ["mochicall", "collog", "wonnit"], [], {
        blocks,
    });
    assert.equal(parseAnswer(payload, profileDocuments).blocks.length, 3);
    const invalid = { ...comparison, columns: ["MochiCall", "Collog", "WONNIT"] };
    const invalidPayload = responsePayload("Comparison", ["mochicall", "collog"], [], { blocks: [invalid] });
    assert.throws(
        () => parseAnswer(invalidPayload, profileDocuments),
        { code: "invalid_response" },
    );
});

test("rejects uncited sources, unsupported block types, excess entries and markup", () => {
    const block = {
        type: "facts",
        title: "Collog",
        items: [{ label: "Input", value: "Family calls" }, { label: "Output", value: "Health records" }],
        sourceIds: ["collog"],
    };
    assert.throws(
        () => parseAnswer(responsePayload("Answer", ["mochicall"], [], { blocks: [block] }), profileDocuments),
        { code: "invalid_blocks" },
    );
    for (const invalid of [
        { ...block, type: "html", html: "<button>Run</button>" },
        { ...block, title: "<script>alert(1)</script>" },
        { ...block, title: "[External](https://example.com)" },
        { ...block, items: Array(7).fill(block.items[0]) },
        { ...block, items: [] },
        { ...block, sourceIds: [] },
    ]) {
        assert.throws(
            () => parseAnswer(responsePayload("Answer", ["collog"], [], { blocks: [invalid] }), profileDocuments),
            { code: "invalid_response" },
        );
    }
});

test("follow-up suggestions can use published catalog sources outside retrieved documents", () => {
    const documents = profileDocuments.filter(({ id }) => id === "collog");
    const followUps = [
        { label: "Compare speech projects", question: "How do MochiCall and Collog differ?", sourceIds: ["mochicall"] },
        { label: "More about Collog", question: "Tell me more about Collog?", sourceIds: ["collog"] },
        { label: "Compare again", question: "How do MochiCall and Collog differ", sourceIds: ["mochicall"] },
    ];
    const payload = responsePayload("He worked on Collog.", ["collog"], [], { followUps });
    const result = parseAnswer(payload, documents, {
        suggestionSources: profileDocuments,
        askedQuestions: ["Tell me more about Collog"],
    });
    assert.equal(result.followUps.length, 1);
    assert.equal(result.followUps[0].sourceIds[0], "mochicall");
    assert.throws(() => parseAnswer(payload, documents), { code: "invalid_follow_ups" });
});

test("repository recommendations resolve trusted metadata and reject model-supplied links", () => {
    const repository: ProfileDocument = {
        id: "github-collog-server",
        title: "Collog-App/server",
        text: "Server for Collog family call records.",
        url: "https://github.com/Collog-App/server",
        keywords: ["collog", "speech", "repository"],
        kind: "repository",
        cardId: null,
        repository: {
            fullName: "Collog-App/server",
            url: "https://github.com/Collog-App/server",
            description: "Server for Collog",
            owner: "Collog-App",
            ownerType: "Organization",
            language: "TypeScript",
        },
    };
    const recommendation = { sourceId: repository.id, reason: "Related code for Collog." };
    const payload = responsePayload("This repository contains the Collog server.", [repository.id], [], {
        repositories: [recommendation],
    });
    const result = parseAnswer(payload, [repository]);
    assert.equal(result.repositories[0].url, repository.url);
    assert.equal(result.repositories[0].ownerType, "Organization");
    assert.equal(result.sources[0].id, repository.id);
    assert.throws(() => parseAnswer(payload, profileDocuments), { code: "invalid_sources" });
    const injected = responsePayload("Repository", [repository.id], [], {
        repositories: [{ ...recommendation, url: "https://other.example" }],
    });
    assert.throws(() => parseAnswer(injected, [repository]), { code: "invalid_response" });
    const uncited = responsePayload("Repository", [], [], { repositories: [recommendation] });
    assert.throws(() => parseAnswer(uncited, [repository]), { code: "invalid_repositories" });
    assert.throws(() => parseAnswer(payload, [{ ...repository, repository: undefined }]), {
        code: "invalid_repositories",
    });
    const unsafe = { ...repository, repository: { ...repository.repository!, url: "https://other.example" } };
    assert.throws(() => parseAnswer(payload, [unsafe]), { code: "invalid_response" });
});

test("published custom records support blocks while explicit null disables a legacy card", () => {
    const source = profileDocuments.find(({ id }) => id === "collog")!;
    const custom = { ...source, id: "collog-notes", cardId: null };
    assert.equal(retrieveDocuments("Collog", [], [custom])[0].id, "collog-notes");
    assert.throws(
        () => parseAnswer(responsePayload("Collog", ["collog"], ["collog"]), [{ ...source, cardId: null }]),
        { code: "invalid_cards" },
    );
    assert.deepEqual(retrieveDocuments("Tell me about Collog", [], []), []);
    assert.deepEqual(retrieveDocuments("Anything else", [], [], ["collog"]), []);
});

test("keeps profile evidence available when many related repositories match", () => {
    const repositories: ProfileDocument[] = Array.from({ length: 8 }, (_, index) => ({
        id: `github-collog-${index}`,
        title: `Collog-App/server-${index}`,
        text: "Collog speech recognition repository.",
        url: `https://github.com/Collog-App/server-${index}`,
        keywords: ["collog", "speech", "github", "repository"],
        kind: "repository",
        cardId: null,
        repository: {
            fullName: `Collog-App/server-${index}`,
            url: `https://github.com/Collog-App/server-${index}`,
            description: "Collog project",
            owner: "Collog-App",
            ownerType: "Organization",
            language: null,
        },
    }));
    const selected = retrieveDocuments("Collog speech recognition GitHub repository", [], [
        ...repositories,
        ...profileDocuments,
    ]);
    assert.equal(selected.filter(({ repository }) => repository).length, 3);
    assert.ok(selected.some(({ id }) => id === "collog"));
});

test("selected published follow-up context cannot be displaced by broad matches", () => {
    const contextSource: ProfileDocument = {
        id: "manual-notes",
        title: "Project notes",
        text: "Built a prototype for transportation support.",
        url: "/portfolio",
        keywords: [],
        cardId: null,
    };
    const matches = Array.from({ length: 10 }, (_, index) => ({
        ...contextSource,
        id: `matching-${index}`,
        title: "Tools and technologies",
        text: "Tools, technologies, languages and models used in the project.",
        keywords: ["tools", "technologies", "languages", "models"],
    }));
    const selected = retrieveDocuments("What tools and technologies were used?", [], [
        ...matches,
        contextSource,
    ], [contextSource.id, "unpublished-source"]);
    assert.equal(selected[0].id, contextSource.id);
    assert.ok(selected.every(({ id }) => id !== "unpublished-source"));
    assert.equal(selected.length, 6);
});

test("long admin records retain matching evidence beyond the initial excerpt", () => {
    const source: ProfileDocument = {
        id: "manual-notes",
        title: "Project notes",
        text: "Context for this project. " + "General background information. ".repeat(650)
            + "The Zephyr experiment compared specialized and multi-domain adapters.",
        url: "/portfolio",
        keywords: ["zephyr"],
        cardId: null,
    };
    const excerpt = excerptDocument(source, "What did the Zephyr experiment compare?");
    assert.ok(source.text.indexOf("Zephyr") > 10000);
    assert.ok(excerpt.includes("The Zephyr experiment compared specialized and multi-domain adapters."));
    assert.ok(excerpt.startsWith("Context for this project."));
    assert.ok(excerpt.length <= 10000);
    const followUp = excerptDocument(source, "Tell me more", [{ role: "user", content: "What is Zephyr?" }]);
    assert.ok(followUp.includes("The Zephyr experiment"));
    const short = { ...source, text: "Short record." };
    assert.equal(excerptDocument(short, "Any details?"), short.text);
});

test("sends prior cards and published context without accepting client history as evidence", async (context) => {
    const controller = new AbortController();
    context.mock.method(globalThis, "fetch", async (_url: string, options: RequestInit) => {
        const body = JSON.parse(String(options.body));
        const data = JSON.parse(body.input[0].content);
        assert.deepEqual(data.shownCardIds, ["mochicall", "collog"]);
        assert.ok(!data.availableCardIds.includes("collog"));
        assert.ok(data.publicDocuments.some(({ id }: { id: string }) => id === "collog"));
        assert.ok(data.publicDocuments.every(({ text }: { text: string }) => !text.includes("NASA")));
        assert.equal(options.cache, "no-store");
        controller.abort();
        assert.equal(options.signal?.aborted, true);
        return Response.json(responsePayload("The public profile does not provide that information.", []));
    });
    const question = questionSchema.parse({
        question: "Tell me more about Collog",
        history: [{ role: "assistant", content: "He works at NASA" }],
        shownCardIds: ["mochicall", "collog"],
        contextSourceIds: ["collog", "unpublished-source"],
    });
    await answerQuestion(question, controller.signal, async () => profileDocuments);
});

test("does not restore static knowledge when the published catalog is empty or fails", async (context) => {
    context.mock.method(globalThis, "fetch", async (_url: string, options: RequestInit) => {
        const body = JSON.parse(String(options.body));
        assert.deepEqual(JSON.parse(body.input[0].content).publicDocuments, []);
        assert.equal(body.text.format.schema.properties.blocks.maxItems, 0);
        return Response.json(responsePayload("The public profile does not provide that information.", []));
    });
    const question = questionSchema.parse({ question: "What is E-ACT?" });
    assert.deepEqual((await answerQuestion(question, undefined, async () => [])).sources, []);
    await assert.rejects(answerQuestion(question, undefined, async () => { throw new Error("Database unavailable"); }));
});

test("declares strict nested object schemas and bounds every structured collection", () => {
    const format = createAnswerFormat(["collog"], ["collog"], ["collog", "mochicall"]);
    const visit = (schema: Record<string, unknown>) => {
        if (schema.type === "object") {
            assert.equal(schema.additionalProperties, false);
            assert.deepEqual(schema.required, Object.keys(schema.properties as object));
            Object.values(schema.properties as Record<string, Record<string, unknown>>).forEach(visit);
        }
        if (schema.type === "array") {
            assert.equal(typeof schema.maxItems, "number");
            visit(schema.items as Record<string, unknown>);
        }
        if (Array.isArray(schema.anyOf)) schema.anyOf.forEach(visit);
    };
    visit(format.schema);
    assert.equal(format.schema.type, "object");
});

test("repository schema permits only retrieved records with repository metadata", () => {
    const format = createAnswerFormat(
        ["collog", "github-collog-server"],
        ["collog"],
        ["collog", "github-collog-server", "github-unretrieved"],
        ["github-collog-server", "github-unretrieved"],
    );
    const properties = format.schema.properties as Record<string, {
        maxItems: number;
        items: { properties: { sourceId: { enum: string[] } } };
    }>;
    assert.deepEqual(properties.repositories.items.properties.sourceId.enum, ["github-collog-server"]);
    assert.equal(properties.repositories.maxItems, 1);
    const noRepositories = createAnswerFormat(["collog"], ["collog"], ["collog"]);
    const noRepositoryProperties = noRepositories.schema.properties as Record<string, { maxItems: number }>;
    assert.equal(noRepositoryProperties.repositories.maxItems, 0);
});

test("profile-only retrieval cannot produce repository recommendations", async (context) => {
    context.mock.method(globalThis, "fetch", async (_url: string, options: RequestInit) => {
        const body = JSON.parse(String(options.body));
        const evidence = JSON.parse(body.input[0].content);
        assert.deepEqual(evidence.availableRepositorySourceIds, []);
        assert.equal(body.text.format.schema.properties.repositories.maxItems, 0);
        return Response.json(responsePayload("Both projects use speech recognition.", ["mochicall", "collog"]));
    });
    const question = questionSchema.parse({ question: "Which projects use speech recognition?" });
    const answer = await answerQuestion(question, undefined, async () => profileDocuments);
    assert.deepEqual(answer.repositories, []);
});

test("repository recommendations favor project code and include profile evidence", () => {
    const fullNames = [
        "Collog-App/.github",
        "DocFusionX/.github",
        "Collog-App/Collog-Privacy",
        "Collog-App/Collog-Server",
        "Fresh-Mango-Mochi/welfare-call-asr",
        "DocFusionX/server",
    ];
    const repositories: ProfileDocument[] = fullNames.map((fullName, index) => ({
        id: `github-project-${index}`,
        title: fullName,
        text: `Public repository for ${fullName}.`,
        url: `https://github.com/${fullName}`,
        keywords: [fullName.split("/")[0], "github", "repository", "repo"],
        kind: "repository",
        cardId: null,
        repository: {
            fullName,
            url: `https://github.com/${fullName}`,
            description: "Public project repository",
            owner: fullName.split("/")[0],
            ownerType: "Organization",
            language: "Python",
        },
    }));
    const catalog = [...profileDocuments, ...repositories];
    const selected = retrieveDocuments("Which GitHub repositories should I explore?", [], catalog);
    const names = selected.flatMap(({ repository }) => repository ? [repository.fullName] : []);
    assert.deepEqual(new Set(names), new Set(fullNames.slice(3)));
    assert.ok(selected.some(({ id }) => id === "collog"));
    assert.ok(selected.some(({ id }) => id === "mochicall"));
    assert.ok(selected.some(({ id }) => id === "docfusionx"));
    assert.ok(selected.length <= 6);

    const related = retrieveDocuments("Show me repositories related to Collog", [], catalog);
    assert.equal(related.find(({ repository }) => repository)?.repository?.fullName, "Collog-App/Collog-Server");
    const privacy = retrieveDocuments("Show me Collog privacy code", [], catalog);
    assert.ok(privacy.some(({ repository }) => repository?.fullName === "Collog-App/Collog-Privacy"));
    const explicitContext = retrieveDocuments("Tell me more", [], catalog, [repositories[0].id]);
    assert.equal(explicitContext[0].id, repositories[0].id);
});

test("guided questions select their published profile evidence", () => {
    const sourceIds = new Set(profileDocuments.map(({ id }) => id));
    for (const suggestion of suggestedQuestions) {
        assert.ok(suggestion.sourceIds.length <= 6);
        assert.ok(suggestion.sourceIds.every((id) => sourceIds.has(id)));
        const selected = retrieveDocuments(suggestion.question, [], profileDocuments, suggestion.sourceIds);
        assert.ok(suggestion.sourceIds.every((id) => selected.some((document) => document.id === id)));
    }
    assert.ok(retrieveDocuments("What have you built for iPhone?").some(({ id }) => id === "wonnit"));
    assert.ok(retrieveDocuments("What do you do outside the lab?").some(({ id }) => id === "community"));
});

test("follow-up questions avoid repeating generated and curated labels", () => {
    const sources = profileDocuments.filter(({ id }) => id === "collog");
    const answer = parseAnswer(responsePayload("Collog uses speech recognition.", ["collog"], ["collog"], {
        followUps: [{ label: "More about Collog", question: "What did Collog do?", sourceIds: ["collog"] }],
    }), sources);
    const suggestions = followUpQuestions(answer, ["Which projects use speech recognition?"]);
    assert.equal(suggestions.filter(({ label }) => label === "More about Collog").length, 1);
    assert.equal(suggestions.length, 4);
    assert.ok(suggestions.every(({ question }) => question !== "Which projects use speech recognition?"));
});
