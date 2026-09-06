import { ensureSchema, sql } from "../db";
import { unstable_cache } from "next/cache";
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

export const listPublishedKnowledge = unstable_cache(async () => {
    await ensureSchema();
    const rows = await sql`
        select doc, status from content_entries
        where type = 'profile_knowledge' and status = 'published'
        order by order_index asc, title asc
    ` as KnowledgeRow[];
    return rows.map(({ doc, status }) => effectivePublishedSource(
        KnowledgeSourceSchema.parse({ ...(doc as object), status }),
    ));
}, ["published-profile-knowledge-v1"], { tags: ["profile-knowledge"], revalidate: 300 });

export async function getKnowledgeSource(id: string): Promise<KnowledgeSource | null> {
    await ensureSchema();
    const rows = await sql`
        select doc, status from content_entries
        where type = 'profile_knowledge' and slug = ${id}
        limit 1
    ` as KnowledgeRow[];
    if (!rows[0]) return null;
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

export async function saveGitHubKnowledgeSources(input: KnowledgeSource[]) {
    const sources = input.map((item) => KnowledgeSourceSchema.parse(item));
    if (sources.some((source) => source.origin !== "github" || !source.repository)) {
        throw new Error("Expected GitHub repositories.");
    }
    if (!sources.length) return;
    await ensureSchema();
    await sql.transaction([sql`
        insert into content_entries (id, type, slug, title, status, order_index, doc, updated_at)
        select 'profile-knowledge-' || (source->>'id'), 'profile_knowledge', source->>'id', source->>'title',
            source->>'status', 2000, source, now()
        from jsonb_array_elements(${JSON.stringify(sources)}::jsonb) as source
        on conflict (type, slug) do update set
            doc = jsonb_set(content_entries.doc, '{repository}', excluded.doc->'repository'),
            updated_at = now()
        where content_entries.doc->>'origin' = 'github'
    `], { fetchOptions: { signal: AbortSignal.timeout(10_000) } });
}
