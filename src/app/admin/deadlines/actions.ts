"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/app/lib/admin-session";
import { deleteConference, getConference, saveConference } from "@/app/lib/deadlines/repository";
import { ConferenceSchema, conferenceId, type Conference } from "@/app/lib/deadlines/schema";

type ActionResult<T> = { ok: true; value: T } | { ok: false; error: string };

function refreshDeadlines() {
    updateTag("deadlines");
    revalidatePath("/admin/deadlines");
}

export async function saveConferenceAction(input: unknown, create = false): Promise<ActionResult<Conference>> {
    await requireAdmin();
    const parsed = ConferenceSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the conference fields." };
    const conference = create ? { ...parsed.data, id: conferenceId(parsed.data.name, parsed.data.year) } : parsed.data;
    try {
        const existing = await getConference(conference.id);
        if (create && existing) return { ok: false, error: "This conference and year already exist." };
        if (!create && !existing) return { ok: false, error: "This conference could not be found. Refresh and try again." };
        const saved = await saveConference(conference);
        refreshDeadlines();
        return { ok: true, value: saved };
    } catch {
        return { ok: false, error: "Changes could not be saved. Check for a duplicate name and year, then try again." };
    }
}

export async function deleteConferenceAction(id: unknown): Promise<ActionResult<null>> {
    await requireAdmin();
    const parsed = ConferenceSchema.shape.id.safeParse(id);
    if (!parsed.success) return { ok: false, error: "Select a valid conference." };
    try {
        await deleteConference(parsed.data);
        refreshDeadlines();
        return { ok: true, value: null };
    } catch {
        return { ok: false, error: "This conference could not be deleted. Try again." };
    }
}
