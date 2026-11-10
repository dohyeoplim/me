import "server-only";
import { parseCcfddlFeed } from "./ccfddl";
import { replaceSyncedConferences } from "./repository";
import { CCFDDL_FEED_URL, trackedConferences } from "./sources";

const MAX_FEED_BYTES = 5_000_000;

async function fetchFeed() {
    const response = await fetch(CCFDDL_FEED_URL, { signal: AbortSignal.timeout(15_000), cache: "no-store" });
    if (!response.ok || !response.body) throw new Error(`Feed request failed with ${response.status}.`);
    if (Number(response.headers.get("content-length") ?? 0) > MAX_FEED_BYTES) throw new Error("Feed is too large.");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_FEED_BYTES) {
            await reader.cancel();
            throw new Error("Feed is too large.");
        }
        chunks.push(value);
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function syncConferenceDeadlines(now = Date.now()) {
    const conferences = parseCcfddlFeed(await fetchFeed(), trackedConferences, now);
    // A partial feed would otherwise delete most rows, so keep the previous data when too few entries parse.
    if (conferences.length < Math.ceil(trackedConferences.length / 2)) throw new Error("Feed is missing conferences.");
    return { synced: await replaceSyncedConferences(conferences), tracked: trackedConferences.length };
}
