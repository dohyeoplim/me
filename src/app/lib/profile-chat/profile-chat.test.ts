import assert from "node:assert/strict";
import test from "node:test";
import { answerQuestion, parseAnswer } from "./answer";
import { profileDocuments } from "./documents";
import { consumeLocalBudget } from "./rate-limit";
import { retrieveDocuments } from "./retrieval";
import { ChatError, maxBodyBytes, questionSchema, readQuestion, validateOrigin } from "./validation";

function request(body: unknown, headers: Record<string, string> = {}) {
    return new Request("https://example.com/api/profile-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
    });
}

function responsePayload(answer: string, sourceIds: string[], cardIds: string[] = []) {
    return {
        status: "completed",
        output: [
            { type: "reasoning", summary: [] },
            {
                type: "message",
                content: [{ type: "output_text", text: JSON.stringify({ answer, sourceIds, cardIds }) }],
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
    assert.throws(() => parseAnswer(responsePayload("Unverified", ["https://other.example"]), documents), {
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
        code: "invalid_cards",
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
        assert.equal(body.max_output_tokens, 700);
        assert.equal(body.text.format.type, "json_schema");
        assert.equal(body.text.format.strict, true);
        assert.equal(body.input.at(-1).content, "What is E-ACT?");
        assert.ok(options.signal);
        return Response.json(responsePayload("A decoder for structured identifier recognition.", ["eact"]));
    });

    assert.equal((await answerQuestion({ question: "What is E-ACT?", history: [] })).sources[0].id, "eact");
});

test("does not expose upstream error contents", async (context) => {
    context.mock.method(globalThis, "fetch", async () => new Response("sensitive upstream error", { status: 401 }));
    await assert.rejects(answerQuestion({ question: "What is E-ACT?", history: [] }), {
        message: "Chat is temporarily unavailable. Please try again later.",
        code: "upstream_unavailable",
    });
});
