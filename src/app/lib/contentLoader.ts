import { unstable_cache } from "next/cache";
import { sql, ensureSchema } from "@/app/lib/db";
import { getIntro } from "@/app/lib/content/repository";
import { EntrySchema, INTRO_DEFAULT } from "@/app/lib/content/schema";
import type { Entry, IntroDoc } from "@/app/lib/content/schema";

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

export const loadEntriesByType = (type: string): Promise<Entry[]> =>
    unstable_cache(
        async () => {
            await ensureSchema();
            const rows = (await sql`
                select * from content_entries
                where type = ${type}
                order by order_index asc, slug asc
            `) as Row[];
            return rows.map(toEntry);
        },
        ["content-list", type],
        { tags: ["content", `content:${type}`] },
    )();

export const loadIntro = (): Promise<IntroDoc> =>
    unstable_cache(
        async () => (await getIntro()) ?? INTRO_DEFAULT,
        ["content-intro"],
        { tags: ["content", "content:intro"] },
    )();
