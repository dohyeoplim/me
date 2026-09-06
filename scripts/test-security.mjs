import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
import { hashSecret, readEnvValue, setEnvValue, upgradeSecretDigest } from "./lib/admin-secrets.mjs";

const require = createRequire(import.meta.url);

function loadModule(path, dependencies = {}, environment = {}) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    const loaded = { exports: {} };
    const localRequire = (name) => {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        if (name.startsWith("node:")) return require(name);
        throw new Error(`Unexpected test dependency ${name}`);
    };
    new Function("require", "module", "exports", "process", outputText)(
        localRequire, loaded, loaded.exports, { env: environment },
    );
    return loaded.exports;
}

test("admin data access rejects absent, false, and non-boolean admin claims before querying", async () => {
    let user;
    const session = loadModule("src/app/lib/admin-session/index.ts", {
        "server-only": {},
        react: { cache: (value) => value },
        "next/navigation": { redirect: () => { throw new Error("Sign in required"); } },
        "@/auth": { auth: async () => ({ user }) },
    });
    let reads = 0;
    const repository = loadModule("src/app/lib/content/repository.ts", {
        "server-only": {},
        "@/app/lib/admin-session": session,
        "@/app/lib/db": { ensureSchema: () => { reads++; throw new Error("Database reached"); } },
        "./row": {},
        "./schema": {},
    });
    for (const claim of [undefined, false, "true", 1, {}]) {
        user = claim === undefined ? undefined : { admin: claim };
        await assert.rejects(session.requireAdminPage(), /Sign in required/);
        for (const operation of Object.values(repository)) {
            await assert.rejects(operation("type", "slug"), /Unauthorized/);
        }
    }
    assert.equal(reads, 0);
    user = { admin: true };
    await assert.doesNotReject(session.requireAdmin());
});

test("schema initialization retries after failure and shares successful concurrent work", async () => {
    let calls = 0;
    const db = loadModule("src/app/lib/db.ts", {
        "@neondatabase/serverless": { neon: () => async () => {
            if (++calls === 1) throw new Error("Temporary failure");
        } },
    }, { DATABASE_URL: "postgres://example.invalid/test" });
    await assert.rejects(db.ensureSchema(), /Temporary failure/);
    const first = db.ensureSchema();
    const second = db.ensureSchema();
    assert.equal(first, second);
    await Promise.all([first, second]);
    await db.ensureSchema();
    assert.equal(calls, 2);
});

test("CSV cells neutralize formulas and preserve quotation and plain text", () => {
    const { csvCell } = loadModule("src/app/lib/csv/index.ts");
    for (const text of ["=1+1", "+SUM(A1)", "-1+2", "@SUM(A1)", "\t=1", "\r=1", "\n=1", "  =1", "\0=1"]) {
        assert.ok(csvCell(text).startsWith('"\''));
    }
    assert.equal(csvCell('He said "hello"'), '"He said ""hello"""');
    assert.equal(csvCell("A normal title"), '"A normal title"');
    assert.equal(csvCell(null), '""');
});

test("image upload rules reject SVG and excessive file sizes", () => {
    const { imageUploadError, imageUploadLimit, imageUploadTypes } = loadModule("src/app/lib/uploads/index.ts");
    assert.ok(imageUploadError({ type: "image/svg+xml", size: 10 }));
    assert.ok(imageUploadError({ type: "image/png", size: imageUploadLimit + 1 }));
    for (const type of imageUploadTypes) assert.equal(imageUploadError({ type, size: imageUploadLimit }), null);
});

test("production admin CSP permits only nonce scripts and prevents framing and inline event handlers", () => {
    const { contentSecurityPolicy, securityHeaders } = loadModule("src/app/lib/security/headers.ts");
    const policy = contentSecurityPolicy({ development: false, nonce: "test-nonce" });
    const scripts = policy.split("; ").find((value) => value.startsWith("script-src "));
    assert.match(scripts, /'nonce-test-nonce' 'strict-dynamic'/);
    assert.doesNotMatch(scripts, /unsafe-inline|unsafe-eval/);
    assert.match(policy, /script-src-attr 'none'/);
    assert.match(policy, /frame-ancestors 'none'/);
    assert.match(policy, /object-src 'none'/);
    assert.match(policy, /form-action 'self'/);
    assert.match(policy, /https:\/\/vercel.com\/api\/blob/);
    assert.ok(securityHeaders(false).some(({ key }) => key === "Strict-Transport-Security"));
    assert.ok(!securityHeaders(true).some(({ key }) => key === "Strict-Transport-Security"));
});

test("upload tokens require an admin session and never expose internal errors", async () => {
    const uploads = loadModule("src/app/lib/uploads/index.ts");
    let admin = false;
    const route = loadModule("src/app/api/blob/upload/route.ts", {
        "@/auth": { auth: async () => ({ user: { admin } }) },
        "@/app/lib/uploads": uploads,
        "@vercel/blob/client": { handleUpload: async ({ onBeforeGenerateToken }) => onBeforeGenerateToken() },
    });
    const request = () => new Request("https://example.com/api/blob/upload", { method: "POST", body: "{}" });
    const denied = await route.POST(request());
    assert.equal(denied.status, 400);
    assert.doesNotMatch(await denied.text(), /Unauthorized|Error|stack/);
    admin = true;
    const allowed = await route.POST(request());
    const options = await allowed.json();
    assert.equal(options.maximumSizeInBytes, 10 * 1024 * 1024);
    assert.ok(!options.allowedContentTypes.includes("image/svg+xml"));
    assert.equal(options.addRandomSuffix, true);
    const invalid = await route.POST(new Request("https://example.com", { method: "POST", body: "{" }));
    assert.equal(invalid.status, 400);
});

test("credential setup and migration produce hashes accepted by the server without rotating passwords", async () => {
    const secrets = loadModule("src/app/lib/admin-auth/secrets.ts");
    const digest = secrets.secretDigest("existing-password");
    const stored = upgradeSecretDigest(digest);
    assert.equal(await secrets.verifySecretDigest(digest, stored), true);
    assert.equal(await secrets.verifySecretDigest(secrets.secretDigest("wrong-password"), stored), false);
    assert.equal(upgradeSecretDigest(stored), stored);
    assert.equal(await secrets.verifySecretDigest(digest, hashSecret("existing-password")), true);
    const env = setEnvValue("UNRELATED=retained\n", "AUTH_ADMIN_PASSWORD_HASH", stored);
    assert.match(env, /UNRELATED=retained/);
    assert.match(env, /scrypt-sha256\./);
    assert.equal(env.includes("$"), false);
    assert.equal(readEnvValue(env, "AUTH_ADMIN_PASSWORD_HASH"), stored);
});

test("chat prefilter keeps existing allowances and blocks repeated DB requests after the client limit", async () => {
    const local = loadModule("src/app/lib/rate-limit/index.ts");
    let queries = 0;
    const sql = () => ({});
    sql.transaction = async () => {
        queries++;
        return [[], [], [{ allowed: true, retry_after: 0 }]];
    };
    const env = {
        NODE_ENV: "production", VERCEL: "1", AUTH_SECRET: "unit-test-auth-secret",
        OPENAI_API_KEY: "unit-test-api-key", DATABASE_URL: "postgres://example.invalid/test",
    };
    const limiter = loadModule("src/app/lib/profile-chat/rate-limit.ts", {
        "@neondatabase/serverless": { neon: () => sql }, "../rate-limit": local,
    }, env);
    assert.equal(limiter.clientLimit, 50);
    assert.equal(limiter.dailyLimit, 1000);
    const request = new Request("https://example.com", { headers: { "x-vercel-forwarded-for": "192.0.2.10" } });
    for (let index = 0; index < 50; index++) assert.equal((await limiter.consumeChatBudget(request)).allowed, true);
    env.OPENAI_API_KEY = "rotated-unit-test-api-key";
    assert.equal((await limiter.consumeChatBudget(request)).allowed, false);
    assert.equal(queries, 50);
});
