"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
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

export type ArxivMeta = {
    title: string;
    summary: string;
    authors: string;
    venue: string;
    year: string;
    url: string;
};

function parseArxivId(input: string): string {
    const s = input.trim();
    const fromUrl = s.match(/arxiv\.org\/(?:abs|pdf)\/([^\s?#]+)/i);
    if (fromUrl) return fromUrl[1].replace(/\.pdf$/i, "");
    const bare = s.match(/(?:arxiv:)?\s*([\w.-]+\/\d+|\d{4}\.\d{4,5})(v\d+)?/i);
    return bare ? bare[1] + (bare[2] ?? "") : "";
}

export async function fetchArxiv(query: string): Promise<ArxivMeta> {
    await requireAdmin();
    const id = parseArxivId(query);
    if (!id) throw new Error("Could not read an arXiv id from that input.");

    const res = await fetch(
        `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(id)}&max_results=1`,
        { cache: "no-store" },
    );
    if (!res.ok) throw new Error("arXiv request failed.");

    const xml = await res.text();
    const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
    if (!entry) throw new Error("No paper found for that id.");

    const pick = (re: RegExp) =>
        entry.match(re)?.[1]?.replace(/\s+/g, " ").trim() ?? "";

    const published = pick(/<published>([\s\S]*?)<\/published>/);
    const journalRef = pick(
        /<arxiv:journal_ref[^>]*>([\s\S]*?)<\/arxiv:journal_ref>/,
    );
    const authors = [
        ...entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g),
    ].map((m) => m[1].replace(/\s+/g, " ").trim());

    return {
        title: pick(/<title>([\s\S]*?)<\/title>/),
        summary: pick(/<summary>([\s\S]*?)<\/summary>/),
        authors: authors.join(", "),
        venue: journalRef,
        year: published.slice(0, 4),
        url: `https://arxiv.org/abs/${id.replace(/v\d+$/, "")}`,
    };
}

export async function saveIntro(doc: IntroDoc) {
    await requireAdmin();
    const parsed = IntroDocSchema.parse(doc);
    await upsertIntro(parsed);
    updateTag("content");
    updateTag("content:intro");
}

export async function signOutAction() {
    await signOut({ redirectTo: "/admin/signin" });
}
