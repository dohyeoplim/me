import { sql, ensureSchema } from "@/app/lib/db";
import { ContentDocSchema, EntrySchema } from "./schema";
import type { ContentDoc, Entry } from "./schema";

type Row = {
    id: string;
    type: string;
    slug: string;
    title: string;
    status: string;
    order_index: number;
    doc: unknown;
    updated_at: string;
};

function toEntry(row: Row): Entry {
    return EntrySchema.parse({
        id: row.id,
        type: row.type,
        slug: row.slug,
        title: row.title,
        status: row.status,
        orderIndex: row.order_index,
        doc: row.doc,
        updatedAt: new Date(row.updated_at).toISOString(),
    });
}

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

export async function reorderEntries(type: string, ids: string[]) {
    await ensureSchema();
    for (let i = 0; i < ids.length; i++) {
        await sql`
            update content_entries set order_index = ${i}
            where type = ${type} and id = ${ids[i]}
        `;
    }
}
