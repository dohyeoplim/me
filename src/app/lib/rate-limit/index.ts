export type Budget = { key: string; expiresAt: number; limit: number };
export type Counter = { expiresAt: number; count: number };
export type RateLimitResult = { allowed: boolean; retryAfter: number };

export function consumeLocalBudget(budgets: Budget[], now: number, counters = new Map<string, Counter>()) {
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

    if (counters.size >= 10_000 && budgets.some(({ key }) => !counters.has(key))) {
        return { allowed: false, retryAfter: 60 };
    }
    for (const { key, expiresAt } of budgets) {
        counters.set(key, { expiresAt, count: (counters.get(key)?.count ?? 0) + 1 });
    }
    return { allowed: true, retryAfter: 0 };
}
