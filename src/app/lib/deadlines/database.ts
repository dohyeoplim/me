import { sql } from "../db";

let ready: Promise<void> | null = null;

export function ensureDeadlinesSchema() {
    ready ??= sql`create table if not exists conference_deadlines (
        id text primary key, name text not null, year int not null, area text not null, url text not null,
        location text not null default '', dates text not null default '',
        deadlines jsonb not null default '[]',
        status text not null check (status in ('draft', 'published')),
        updated_at timestamptz not null default now()
    )`.then(() => {}).catch((error) => { ready = null; throw error; });
    return ready;
}
