"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/app/lib/admin-session";
import { setConferenceVisibility } from "@/app/lib/deadlines/repository";
import { ConferenceSchema } from "@/app/lib/deadlines/schema";
import { syncConferenceDeadlines } from "@/app/lib/deadlines/sync";
import { z } from "@/app/lib/schema";

type ActionResult<T> = { ok: true; value: T } | { ok: false; error: string };

function refreshDeadlines() {
    updateTag("deadlines");
    revalidatePath("/admin/deadlines");
}

export async function syncDeadlinesAction(): Promise<ActionResult<number>> {
    await requireAdmin();
    try {
        const { synced } = await syncConferenceDeadlines();
        refreshDeadlines();
        return { ok: true, value: synced };
    } catch {
        return { ok: false, error: "Deadlines could not be synced. Existing data was kept. Try again later." };
    }
}

const VisibilitySchema = z.object({ id: ConferenceSchema.shape.id, status: ConferenceSchema.shape.status });

export async function setConferenceVisibilityAction(input: unknown): Promise<ActionResult<null>> {
    await requireAdmin();
    const parsed = VisibilitySchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Select a valid conference and visibility." };
    try {
        await setConferenceVisibility(parsed.data.id, parsed.data.status);
        refreshDeadlines();
        return { ok: true, value: null };
    } catch {
        return { ok: false, error: "Visibility could not be updated. Try again." };
    }
}
