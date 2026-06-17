"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { updateTag } from "next/cache";
import { auth } from "@/auth";
import { ContentDocSchema } from "@/app/lib/content/schema";
import { upsertEntry } from "@/app/lib/content/repository";

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

const HOME_SECTIONS = ["about", "experience", "projects"] as const;

export async function seedFromFiles() {
    await requireAdmin();
    for (let i = 0; i < HOME_SECTIONS.length; i++) {
        const slug = HOME_SECTIONS[i];
        const file = path.join(process.cwd(), "content", "home", `${slug}.json`);
        const raw = JSON.parse(await fs.readFile(file, "utf-8"));
        raw.blocks = (raw.blocks ?? []).map((b: Record<string, unknown>) => ({
            id: crypto.randomUUID(),
            ...b,
        }));
        const doc = ContentDocSchema.parse(raw);
        await upsertEntry({
            id: crypto.randomUUID(),
            type: "home_section",
            slug,
            title: doc.sectionTitle?.title ?? slug,
            status: "published",
            orderIndex: i,
            doc,
        });
        revalidate("home_section", slug);
    }
}
