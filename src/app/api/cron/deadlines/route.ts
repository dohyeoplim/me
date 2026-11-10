import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { syncConferenceDeadlines } from "@/app/lib/deadlines/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const digest = (value: string) => createHash("sha256").update(value).digest();

function authorized(request: Request) {
    const secret = process.env.CRON_SECRET;
    const header = request.headers.get("authorization");
    if (!secret || !header) return false;
    return timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}

export async function GET(request: Request) {
    if (!authorized(request)) return new Response("Unauthorized", { status: 401 });
    try {
        const result = await syncConferenceDeadlines();
        revalidateTag("deadlines", { expire: 0 });
        return Response.json({ ok: true, ...result });
    } catch (error) {
        console.error("deadline_sync_failed", error instanceof Error ? error.message : "unknown");
        return Response.json({ ok: false }, { status: 502 });
    }
}
