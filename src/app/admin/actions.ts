"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { put } from "@vercel/blob";
import { auth, signOut } from "@/auth";
import { ContentDocSchema, IntroDocSchema } from "@/app/lib/content/schema";
import type { IntroDoc } from "@/app/lib/content/schema";
import {
    upsertEntry,
    listEntries,
    deleteEntry as removeEntry,
    reorderEntries as repoReorderEntries,
    upsertIntro,
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
    const slug = crypto.randomUUID();
    const title = String(formData.get("title") ?? "").trim();

    const entries = await listEntries(type);
    await upsertEntry({
        id: crypto.randomUUID(),
        type,
        slug,
        title: title || "Untitled",
        status: "draft",
        orderIndex: entries.length,
        doc: { blocks: [] },
    });
    revalidate(type, slug);

    redirect(`/admin/${type}/${slug}`);
}

export async function deleteEntry(type: string, slug: string) {
    await requireAdmin();
    await removeEntry(type, slug);
    revalidate(type, slug);
    redirect("/admin");
}

export async function reorderEntries(type: string, ids: string[]) {
    await requireAdmin();
    await repoReorderEntries(type, ids);
    updateTag("content");
    updateTag(`content:${type}`);
}

export async function saveIntro(doc: IntroDoc) {
    await requireAdmin();
    const parsed = IntroDocSchema.parse(doc);
    await upsertIntro(parsed);
    updateTag("content");
    updateTag("content:intro");
}

export async function uploadImage(formData: FormData) {
    await requireAdmin();
    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("No file");
    const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
    });
    return blob.url;
}

export async function signOutAction() {
    await signOut({ redirectTo: "/admin/signin" });
}
