import { EntrySchema } from "./schema";
import type { Entry } from "./schema";

export type Row = {
    id: string;
    type: string;
    slug: string;
    title: string;
    status: string;
    order_index: number;
    doc: unknown;
    updated_at: string;
};

export function toEntry(row: Row): Entry {
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
