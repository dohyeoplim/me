import { ensureSchema, sql } from "../db";
import { KnowledgeSourceSchema, type KnowledgeSource } from "./schema";
import { createPortfolioSources, effectivePublishedSource } from "./sources";

type KnowledgeRow = { doc: unknown; status: string };

export async function ensureKnowledgeSeeded() {
    await ensureSchema();
    const sources = createPortfolioSources();
    await sql`
        with initialized as (
            insert into content_entries (id, type, slug, title, status, doc)
            values (
                'profile-knowledge-seed-v1', 'profile_knowledge_settings', 'seed-v1',
                'Profile knowledge setup', 'draft', '{"initialized": true}'::jsonb
            )
            on conflict (type, slug) do nothing
            returning id
        )
        insert into content_entries (id, type, slug, title, status, order_index, doc)
        select 'profile-knowledge-' || (source->>'id'), 'profile_knowledge', source->>'id',
            source->>'title', source->>'status', seed_order::int, source
        from jsonb_array_elements(${JSON.stringify(sources)}::jsonb) with ordinality as data(source, seed_order)
        where exists (select 1 from initialized)
        on conflict (type, slug) do nothing
    `;
}

export async function listKnowledgeSources(): Promise<KnowledgeSource[]> {
    await ensureSchema();
    const rows = await sql`
        select doc, status from content_entries
        where type = 'profile_knowledge'
        order by order_index asc, title asc
    ` as KnowledgeRow[];
    return rows.map(({ doc, status }) => KnowledgeSourceSchema.parse({ ...(doc as object), status }));
}

export async function listPublishedKnowledge() {
    const sources = await listKnowledgeSources();
    return sources.filter(({ status }) => status === "published").map(effectivePublishedSource);
}

export async function getKnowledgeSource(id: string): Promise<KnowledgeSource | null> {
    await ensureSchema();
    const rows = await sql`
        select doc, status from content_entries
        where type = 'profile_knowledge' and slug = ${id}
        limit 1
    ` as KnowledgeRow[];
    if (!rows.length) return null;
    return KnowledgeSourceSchema.parse({ ...(rows[0].doc as object), status: rows[0].status });
}

export async function saveKnowledgeSource(input: KnowledgeSource) {
    const source = KnowledgeSourceSchema.parse(input);
    await ensureSchema();
    await sql`
        insert into content_entries (id, type, slug, title, status, order_index, doc, updated_at)
        values (
            ${`profile-knowledge-${source.id}`}, 'profile_knowledge', ${source.id}, ${source.title},
            ${source.status}, 1000, ${JSON.stringify(source)}, now()
        )
        on conflict (type, slug) do update set
            title = excluded.title,
            status = excluded.status,
            doc = excluded.doc,
            updated_at = now()
    `;
    return source;
}

export async function archiveKnowledgeSource(id: string) {
    await ensureSchema();
    await sql`
        update content_entries set status = 'draft',
            doc = jsonb_set(doc, '{status}', '"draft"'::jsonb), updated_at = now()
        where type = 'profile_knowledge' and slug = ${id}
    `;
}

export async function saveGitHubKnowledgeSource(input: KnowledgeSource) {
    const source = KnowledgeSourceSchema.parse(input);
    if (source.origin !== "github" || !source.repository) throw new Error("Expected a GitHub repository.");
    await ensureSchema();
    await sql`
        insert into content_entries (id, type, slug, title, status, order_index, doc, updated_at)
        values (
            ${`profile-knowledge-${source.id}`}, 'profile_knowledge', ${source.id}, ${source.title},
            ${source.status}, 2000, ${JSON.stringify(source)}, now()
        )
        on conflict (type, slug) do update set
            doc = jsonb_set(content_entries.doc, '{repository}', excluded.doc->'repository'),
            updated_at = now()
        where content_entries.doc->>'origin' = 'github'
    `;
}
