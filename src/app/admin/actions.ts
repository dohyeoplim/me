"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { auth, signOut } from "@/auth";
import {
    ContentDocSchema,
    IntroDocSchema,
    PostDocSchema,
    POST_DOC_DEFAULT,
} from "@/app/lib/content/schema";
import type { IntroDoc, PostDoc } from "@/app/lib/content/schema";
import {
    upsertEntry,
    listEntries,
    deleteEntry as removeEntry,
    reorderEntries as repoReorderEntries,
    upsertIntro,
    upsertPost,
} from "@/app/lib/content/repository";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
}

function purge(tag: string) {
    revalidateTag(tag, "max");
}

function revalidate(type: string, slug: string) {
    purge("content");
    purge(`content:${type}`);
    purge(`content:${type}:${slug}`);
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
    purge("content");
    purge(`content:${type}`);
}

export type SavePostInput = {
    id: string;
    slug: string;
    title: string;
    status: "draft" | "published";
    doc: PostDoc;
};

export async function savePost(input: SavePostInput) {
    await requireAdmin();
    const doc = PostDocSchema.parse(input.doc);
    await upsertPost({ ...input, doc });
    revalidate("post", input.slug);
}

export async function createPost(formData: FormData) {
    await requireAdmin();
    const slug = crypto.randomUUID();
    const title = String(formData.get("title") ?? "").trim();

    await upsertPost({
        id: crypto.randomUUID(),
        slug,
        title: title || "Untitled",
        status: "draft",
        doc: POST_DOC_DEFAULT,
    });
    revalidate("post", slug);

    redirect(`/admin/post/${slug}`);
}

export async function saveIntro(doc: IntroDoc) {
    await requireAdmin();
    const parsed = IntroDocSchema.parse(doc);
    await upsertIntro(parsed);
    purge("content");
    purge("content:intro");
}

export async function signOutAction() {
    await signOut({ redirectTo: "/admin/signin" });
}
