import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import * as OTPAuth from "otpauth";

const period = 30;
const clientLimit = 5;
const attemptWindowSeconds = 10 * 60;

type CredentialMatch =
    | { kind: "totp"; counter: number; recoveryHash: null }
    | { kind: "recovery"; counter: null; recoveryHash: string };

type RateLimitResult = { allowed: boolean; retryAfter: number };

let schemaReady: Promise<void> | null = null;

function normalizeTotp(value: string) {
    return value.replace(/[\s-]/g, "");
}

export function normalizeRecoveryCode(value: string) {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function hashRecoveryCode(value: string) {
    return createHash("sha256").update(normalizeRecoveryCode(value)).digest("hex");
}

export function hashAccessKey(value: string) {
    return createHash("sha256").update(value.trim()).digest("hex");
}

function safeEqual(first: string, second: string) {
    const left = Buffer.from(first);
    const right = Buffer.from(second);
    return left.length === right.length && timingSafeEqual(left, right);
}

function recoveryHashes() {
    return (process.env.AUTH_TOTP_RECOVERY_HASHES ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter((value) => /^[a-f0-9]{64}$/.test(value))
        .slice(0, 16);
}

export function matchesAdminAccessKey(value: unknown) {
    const expected = process.env.AUTH_ADMIN_ACCESS_HASH?.trim().toLowerCase() ?? "";
    const candidate = typeof value === "string" && value.length <= 200 ? hashAccessKey(value) : hashAccessKey("");
    return /^[a-f0-9]{64}$/.test(expected) && safeEqual(expected, candidate);
}

function credentialId() {
    const secret = process.env.AUTH_TOTP_SECRET!.replace(/\s/g, "").toUpperCase();
    return createHash("sha256").update(secret).digest("hex").slice(0, 32);
}

function totp(secret: string) {
    if (!/^[A-Z2-7]+$/.test(secret)) throw new Error("Invalid TOTP secret.");
    const key = OTPAuth.Secret.fromBase32(secret);
    if (key.bytes.length < 20) throw new Error("Invalid TOTP secret.");
    return new OTPAuth.TOTP({
        issuer: "Dohyeop Lim",
        label: "Admin",
        algorithm: "SHA1",
        digits: 6,
        period,
        secret: key,
    });
}

export function matchAdminCredential(value: unknown, timestamp = Date.now()): CredentialMatch | null {
    if (typeof value !== "string" || value.length > 80) return null;
    const secret = process.env.AUTH_TOTP_SECRET?.replace(/\s/g, "").toUpperCase();
    if (!secret) return null;

    const token = normalizeTotp(value);
    if (/^\d{6}$/.test(token)) {
        try {
            const delta = totp(secret).validate({ token, timestamp, window: 1 });
            if (delta !== null) {
                return {
                    kind: "totp",
                    counter: OTPAuth.TOTP.counter({ period, timestamp }) + delta,
                    recoveryHash: null,
                };
            }
        } catch {
            return null;
        }
    }

    const candidateHash = hashRecoveryCode(value);
    const matchedHash = recoveryHashes().find((hash) => safeEqual(hash, candidateHash));
    return matchedHash ? { kind: "recovery", counter: null, recoveryHash: matchedHash } : null;
}

export function isAdminAuthConfigured() {
    const secret = process.env.AUTH_TOTP_SECRET?.replace(/\s/g, "").toUpperCase();
    const accessHash = process.env.AUTH_ADMIN_ACCESS_HASH?.trim().toLowerCase() ?? "";
    if (
        !process.env.DATABASE_URL?.trim()
        || !process.env.AUTH_SECRET?.trim()
        || !/^[a-f0-9]{64}$/.test(accessHash)
        || !secret
    ) return false;
    try {
        totp(secret);
        return true;
    } catch {
        return false;
    }
}

async function ensureAdminAuthSchema() {
    if (!process.env.DATABASE_URL) throw new Error("Admin authentication is not configured.");
    if (!schemaReady) {
        const sql = neon(process.env.DATABASE_URL);
        schemaReady = (async () => {
            await sql.transaction([
                sql`select pg_advisory_xact_lock(171309220)`,
                sql`
                    create table if not exists admin_auth_rate_limits (
                        key text primary key,
                        request_count integer not null check (request_count > 0),
                        expires_at timestamptz not null
                    )
                `,
                sql`
                    create table if not exists admin_auth_state (
                        id text primary key,
                        last_totp_counter bigint,
                        used_recovery_hashes jsonb not null default '[]'::jsonb,
                        updated_at timestamptz not null default now()
                    )
                `,
                sql`
                    create index if not exists admin_auth_rate_limits_expiration
                    on admin_auth_rate_limits (expires_at)
                `,
            ]);
        })().catch((error) => {
            schemaReady = null;
            throw error;
        });
    }
    return schemaReady;
}

function clientKey(request: Request) {
    const address = process.env.VERCEL === "1"
        ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "shared"
        : "shared";
    return createHmac("sha256", process.env.AUTH_SECRET ?? "missing-auth-secret")
        .update(`admin-auth:${credentialId()}:${address}`)
        .digest("hex");
}

async function consumeAttempt(request: Request): Promise<RateLimitResult> {
    await ensureAdminAuthSchema();
    const sql = neon(process.env.DATABASE_URL!);
    const currentSeconds = Math.floor(Date.now() / 1000);
    const clientExpiresAt = Math.floor(currentSeconds / attemptWindowSeconds + 1) * attemptWindowSeconds;
    const result = await sql.transaction([
        sql`select pg_advisory_xact_lock(171309221)`,
        sql`delete from admin_auth_rate_limits where expires_at <= now()`,
        sql`
            with requested (key, expires_at, request_limit) as (
                values (${`client:${clientKey(request)}`}, to_timestamp(${clientExpiresAt}), ${clientLimit}::integer)
            ), blocked as (
                select counters.expires_at
                from requested
                join admin_auth_rate_limits counters on counters.key = requested.key
                where counters.request_count >= requested.request_limit
            ), claimed as (
                insert into admin_auth_rate_limits (key, request_count, expires_at)
                select key, 1, expires_at from requested where not exists (select 1 from blocked)
                on conflict (key) do update set
                    request_count = admin_auth_rate_limits.request_count + 1,
                    expires_at = excluded.expires_at
                returning key
            )
            select
                (select count(*) from claimed) = 1 as allowed,
                coalesce(ceil(extract(epoch from (select max(expires_at) from blocked) - now())), 0) as retry_after
        `,
    ]);
    const row = result[2]?.[0];
    if (typeof row?.allowed !== "boolean") throw new Error("Admin authentication is unavailable.");
    return { allowed: row.allowed, retryAfter: Number(row.retry_after) || 0 };
}

async function claimCredential(match: CredentialMatch) {
    const stateId = credentialId();
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
        insert into admin_auth_state (id)
        values (${stateId})
        on conflict (id) do nothing
    `;
    const rows = await sql`
        update admin_auth_state
        set
            last_totp_counter = case
                when ${match.counter}::bigint is not null then ${match.counter}::bigint
                else last_totp_counter
            end,
            used_recovery_hashes = case
                when ${match.recoveryHash}::text is not null
                    then used_recovery_hashes || to_jsonb(${match.recoveryHash}::text)
                else used_recovery_hashes
            end,
            updated_at = now()
        where id = ${stateId}
            and (
                (${match.counter}::bigint is not null
                    and (last_totp_counter is null or last_totp_counter < ${match.counter}::bigint))
                or (${match.recoveryHash}::text is not null
                    and not used_recovery_hashes ? ${match.recoveryHash}::text)
            )
        returning id
    `;
    return rows.length === 1;
}

export type AdminCredentialResult = "valid" | "invalid" | "rate-limited";

export async function verifyAdminCredential(
    accessKey: unknown,
    value: unknown,
    request: Request,
): Promise<AdminCredentialResult> {
    if (!isAdminAuthConfigured()) return "invalid";
    const budget = await consumeAttempt(request);
    if (!budget.allowed) return "rate-limited";
    const match = matchAdminCredential(value);
    return matchesAdminAccessKey(accessKey) && match && await claimCredential(match) ? "valid" : "invalid";
}
