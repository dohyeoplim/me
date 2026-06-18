import { sql, ensureSchema } from "@/app/lib/db";
import { toEntry, type Row } from "./row";
import { ContentDocSchema, IntroDocSchema, PostDocSchema, PostSchema } from "./schema";
import type { ContentDoc, Entry, IntroDoc, Post, PostDoc } from "./schema";

export async function listEntries(type: string): Promise<Entry[]> {
    await ensureSchema();
    const rows = (await sql`
        select * from content_entries
        where type = ${type}
        order by order_index asc, slug asc
    `) as Row[];
    return rows.map(toEntry);
}

export async function getEntry(
    type: string,
    slug: string,
): Promise<Entry | null> {
    await ensureSchema();
    const rows = (await sql`
        select * from content_entries
        where type = ${type} and slug = ${slug}
        limit 1
    `) as Row[];
    return rows.length ? toEntry(rows[0]) : null;
}

export type UpsertInput = {
    id: string;
    type: string;
    slug: string;
    title: string;
    status: "draft" | "published";
    orderIndex: number;
    doc: ContentDoc;
};

export async function upsertEntry(input: UpsertInput) {
    await ensureSchema();
    const doc = ContentDocSchema.parse(input.doc);
    await sql`
        insert into content_entries
            (id, type, slug, title, status, order_index, doc, updated_at)
        values (
            ${input.id}, ${input.type}, ${input.slug}, ${input.title},
            ${input.status}, ${input.orderIndex}, ${JSON.stringify(doc)}, now()
        )
        on conflict (type, slug) do update set
            title = excluded.title,
            status = excluded.status,
            order_index = excluded.order_index,
            doc = excluded.doc,
            updated_at = now()
    `;
}

export async function deleteEntry(type: string, slug: string) {
    await ensureSchema();
    await sql`
        delete from content_entries where type = ${type} and slug = ${slug}
    `;
}

export async function getIntro(): Promise<IntroDoc | null> {
    await ensureSchema();
    const rows = (await sql`
        select doc from content_entries
        where type = 'intro' and slug = 'main' limit 1
    `) as { doc: unknown }[];
    return rows.length ? IntroDocSchema.parse(rows[0].doc) : null;
}

export async function upsertIntro(doc: IntroDoc) {
    await ensureSchema();
    const parsed = IntroDocSchema.parse(doc);
    await sql`
        insert into content_entries
            (id, type, slug, title, status, order_index, doc, updated_at)
        values (
            ${crypto.randomUUID()}, 'intro', 'main', 'Intro',
            'published', -1, ${JSON.stringify(parsed)}, now()
        )
        on conflict (type, slug) do update set
            doc = excluded.doc, updated_at = now()
    `;
}

function toPost(row: Row): Post {
    return PostSchema.parse({
        id: row.id,
        slug: row.slug,
        title: row.title,
        status: row.status,
        doc: row.doc,
        updatedAt: new Date(row.updated_at).toISOString(),
    });
}

export async function listPosts(): Promise<Post[]> {
    await ensureSchema();
    const rows = (await sql`
        select * from content_entries
        where type = 'post'
        order by coalesce(doc->>'date', '') desc, updated_at desc
    `) as Row[];
    return rows.map(toPost);
}

export async function getPost(slug: string): Promise<Post | null> {
    await ensureSchema();
    const rows = (await sql`
        select * from content_entries
        where type = 'post' and slug = ${slug}
        limit 1
    `) as Row[];
    return rows.length ? toPost(rows[0]) : null;
}

export type UpsertPostInput = {
    id: string;
    slug: string;
    title: string;
    status: "draft" | "published";
    doc: PostDoc;
};

export async function upsertPost(input: UpsertPostInput) {
    await ensureSchema();
    const doc = PostDocSchema.parse(input.doc);
    await sql`
        insert into content_entries
            (id, type, slug, title, status, order_index, doc, updated_at)
        values (
            ${input.id}, 'post', ${input.slug}, ${input.title},
            ${input.status}, 0, ${JSON.stringify(doc)}, now()
        )
        on conflict (type, slug) do update set
            title = excluded.title,
            status = excluded.status,
            doc = excluded.doc,
            updated_at = now()
    `;
}

export async function reorderEntries(type: string, ids: string[]) {
    await ensureSchema();
    const orders = ids.map((_, i) => i);
    await sql`
        update content_entries as c
        set order_index = v.ord
        from unnest(${ids}::text[], ${orders}::int[]) as v(id, ord)
        where c.type = ${type} and c.id = v.id
    `;
}
