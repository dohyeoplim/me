import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export const clientLimit = 8;
export const dailyLimit = 150;
const clientWindow = 10 * 60 * 1000;
const dayWindow = 24 * 60 * 60 * 1000;

type Budget = { key: string; expiresAt: number; limit: number };
type Counter = { expiresAt: number; count: number };
type RateLimitResult = { allowed: boolean; retryAfter: number };

const localCounters = new Map<string, Counter>();

export function isChatConfigured() {
    return (
        Boolean(process.env.OPENAI_API_KEY?.trim()) &&
        Boolean(process.env.DATABASE_URL || process.env.NODE_ENV !== "production")
    );
}

function clientKey(request: Request) {
    const address =
        process.env.VERCEL === "1"
            ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "shared"
            : "shared";
    const hash = createHmac("sha256", process.env.OPENAI_API_KEY || "local-profile-chat")
        .update(`profile-chat:${address}`)
        .digest("hex");

    return `client:${hash}`;
}

export function consumeLocalBudget(budgets: Budget[], now: number, counters = localCounters): RateLimitResult {
    for (const [key, counter] of counters) {
        if (counter.expiresAt <= now) counters.delete(key);
    }

    const blocked = budgets.filter(({ key, limit }) => (counters.get(key)?.count ?? 0) >= limit);
    if (blocked.length) {
        return {
            allowed: false,
            retryAfter: Math.max(1, Math.ceil((Math.max(...blocked.map(({ expiresAt }) => expiresAt)) - now) / 1000)),
        };
    }

    for (const { key, expiresAt } of budgets) {
        counters.set(key, { expiresAt, count: (counters.get(key)?.count ?? 0) + 1 });
    }

    return { allowed: true, retryAfter: 0 };
}

export async function consumeChatBudget(request: Request): Promise<RateLimitResult> {
    const key = clientKey(request);
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        if (process.env.NODE_ENV === "production") throw new Error("Chat rate limit is unavailable");
        const now = Date.now();
        return consumeLocalBudget(
            [
                { key, expiresAt: (Math.floor(now / clientWindow) + 1) * clientWindow, limit: clientLimit },
                { key: "site", expiresAt: (Math.floor(now / dayWindow) + 1) * dayWindow, limit: dailyLimit },
            ],
            now,
        );
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
