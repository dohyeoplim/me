import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

let schemaReady: Promise<void> | null = null;

export function ensureSchema() {
    if (!schemaReady) {
        schemaReady = (async () => {
            await sql`
                create table if not exists content_entries (
                    id text primary key,
                    type text not null,
                    slug text not null,
                    title text not null default '',
                    status text not null default 'published',
                    order_index int not null default 0,
                    doc jsonb not null,
                    updated_at timestamptz not null default now(),
                    unique (type, slug)
                )
            `;
        })();
    }
    return schemaReady;
}
