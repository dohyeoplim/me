"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { auth, signOut } from "@/auth";
import { ContentDocSchema } from "@/app/lib/content/schema";
import {
    upsertEntry,
    getEntry,
    listEntries,
} from "@/app/lib/content/repository";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
}

function revalidate(type: string, slug: string) {
    updateTag("content");
    updateTag(`content:${type}`);
    updateTag(`content:${type}:${slug}`);
}

export type SaveInput = {
    id: string;
    type: string;
    slug: string;
    title: string;
    status: "draft" | "published";
    orderIndex: number;
    doc: unknown;
};

export async function saveEntry(input: SaveInput) {
    await requireAdmin();
    const doc = ContentDocSchema.parse(input.doc);
    await upsertEntry({ ...input, doc });
    revalidate(input.type, input.slug);
}

export async function createEntry(formData: FormData) {
    await requireAdmin();
    const type = "home_section";
    const slug = String(formData.get("slug") ?? "")
        .trim()
        .toLowerCase();
    const title = String(formData.get("title") ?? "").trim();
    if (!slug) return;

    const existing = await getEntry(type, slug);
    if (!existing) {
        const entries = await listEntries(type);
        await upsertEntry({
            id: crypto.randomUUID(),
            type,
            slug,
            title: title || slug,
            status: "published",
            orderIndex: entries.length,
            doc: { blocks: [] },
        });
        revalidate(type, slug);
    }

    redirect(`/admin/${type}/${slug}`);
}

export async function signOutAction() {
    await signOut({ redirectTo: "/admin/signin" });
}
