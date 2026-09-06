import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { consumeLocalBudget, type Counter, type RateLimitResult } from "../rate-limit";

export { consumeLocalBudget } from "../rate-limit";

export const clientLimit = 50;
export const dailyLimit = 1_000;
const clientWindow = 10 * 60 * 1000;
const dayWindow = 24 * 60 * 60 * 1000;

const localCounters = new Map<string, Counter>();

export function isChatConfigured() {
    return (
        Boolean(process.env.OPENAI_API_KEY?.trim()) &&
        Boolean(process.env.DATABASE_URL || process.env.NODE_ENV !== "production") &&
        Boolean(
            process.env.PROFILE_CHAT_RATE_LIMIT_SECRET || process.env.AUTH_SECRET
            || process.env.NODE_ENV !== "production",
        )
    );
}

function clientKey(request: Request) {
    const address =
        process.env.VERCEL === "1"
            ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "shared"
            : "shared";
    const secret = process.env.PROFILE_CHAT_RATE_LIMIT_SECRET || process.env.AUTH_SECRET;
    if (!secret && process.env.NODE_ENV === "production") throw new Error("Chat rate limit is unavailable");
    const hash = createHmac("sha256", secret || "local-profile-chat")
        .update(`profile-chat:${address}`)
        .digest("hex");

    return `client:${hash}`;
}

export async function consumeChatBudget(request: Request): Promise<RateLimitResult> {
    const key = clientKey(request);
    const databaseUrl = process.env.DATABASE_URL;
    const now = Date.now();
    const prefilter = consumeLocalBudget([
        { key, expiresAt: (Math.floor(now / clientWindow) + 1) * clientWindow, limit: clientLimit },
        { key: "site", expiresAt: (Math.floor(now / dayWindow) + 1) * dayWindow, limit: dailyLimit },
    ], now, localCounters);
    if (!prefilter.allowed) return prefilter;

    if (!databaseUrl) {
        if (process.env.NODE_ENV === "production") throw new Error("Chat rate limit is unavailable");
        return prefilter;
    }

    const sql = neon(databaseUrl);
    const results = await sql.transaction(
        [
            sql`select pg_advisory_xact_lock(714422119)`,
            sql`delete from profile_chat_rate_limits where expires_at <= now()`,
            sql`
            with requested (key, expires_at, request_limit) as (
                values
                    (${key}, to_timestamp((floor(extract(epoch from now()) / 600) + 1) * 600), ${clientLimit}::integer),
                    ('site', (date_trunc('day', now() at time zone 'UTC') at time zone 'UTC')
                        + interval '1 day', ${dailyLimit}::integer)
            ), blocked as (
                select requested.expires_at
                from requested
                join profile_chat_rate_limits counters on counters.key = requested.key
                where counters.request_count >= requested.request_limit
            ), claimed as (
                insert into profile_chat_rate_limits (key, request_count, expires_at)
                select key, 1, expires_at from requested where not exists (select 1 from blocked)
                on conflict (key) do update set
                    request_count = profile_chat_rate_limits.request_count + 1,
                    expires_at = excluded.expires_at
                returning key
            )
            select
                (select count(*) from claimed) = 2 as allowed,
                coalesce(ceil(extract(epoch from (select max(expires_at) from blocked) - now())), 0) as retry_after
        `,
        ],
        {
            isolationLevel: "ReadCommitted",
            fetchOptions: { signal: AbortSignal.timeout(5000) },
        },
    );

    const result = results[2]?.[0];
    if (typeof result?.allowed !== "boolean") throw new Error("Chat rate limit is unavailable");

    return { allowed: result.allowed, retryAfter: Number(result.retry_after) || 0 };
}
