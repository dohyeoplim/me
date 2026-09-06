import { sql } from "../db";

let ready: Promise<void> | null = null;

export function ensureKnowledgeSchema() {
    ready ??= sql.transaction([
        sql`create table if not exists knowledge_sources (
            id text primary key, title text not null, body text not null, url text not null,
            keywords jsonb not null default '[]', kind text not null,
            status text not null check (status in ('draft', 'published')), origin text not null,
            repository jsonb, sort_order int not null default 1000,
            created_at timestamptz not null default now(), updated_at timestamptz not null default now()
        )`,
        sql`create index if not exists knowledge_sources_status_order on knowledge_sources(status, sort_order)`,
        sql`create table if not exists knowledge_embeddings (
            source_id text primary key references knowledge_sources(id) on delete cascade,
            content_hash text not null, data jsonb not null, updated_at timestamptz not null default now()
        )`,
        sql`create table if not exists reserved_components (
            id text primary key, enabled boolean not null default true, source_ids jsonb not null default '[]',
            presentation jsonb, updated_at timestamptz not null default now()
        )`,
        sql`create table if not exists knowledge_settings (key text primary key, value jsonb not null)`,
        sql`create table if not exists knowledge_snapshots (
            id text primary key, description text not null, data jsonb not null,
            created_at timestamptz not null default now()
        )`,
    ]).then(() => {}).catch((error) => { ready = null; throw error; });
    return ready;
}
