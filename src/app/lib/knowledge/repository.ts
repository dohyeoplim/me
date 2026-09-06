import { sql } from "../db";
import { unstable_cache } from "next/cache";
import { KnowledgeSourceSchema, type KnowledgeSource } from "./schema";
import { createPortfolioSources, effectivePublishedSource } from "./sources";
import type { SourceEmbedding } from "./embedding-schema";
import { embeddingHash } from "./embeddings";
import { ensureKnowledgeSchema } from "./database";
import { listReservedComponents } from "../reserved-components/repository";

function decodeSource(row: Record<string, unknown>) {
    return KnowledgeSourceSchema.parse({ ...row, text: row.body,
        repository: row.repository ?? undefined, embedding: row.embedding ?? undefined });
}

export async function ensureKnowledgeSeeded() {
    await ensureKnowledgeSchema();
    const sources = createPortfolioSources();
    await sql`with initialized as (
        insert into knowledge_settings (key, value) values ('seeded', 'true')
        on conflict(key) do nothing returning key
    ) insert into knowledge_sources (id,title,body,url,keywords,kind,status,origin,sort_order)
        select source->>'id',source->>'title',source->>'text',source->>'url',source->'keywords',
            source->>'kind','published','portfolio',position::int
        from jsonb_array_elements(${JSON.stringify(sources)}::jsonb) with ordinality as item(source,position)
        where exists(select 1 from initialized) on conflict(id) do nothing`;
}

export async function listKnowledgeSources(includeEmbeddings = false) {
    await ensureKnowledgeSchema();
    const [rows, components] = await Promise.all([
        sql`select s.*, case when ${includeEmbeddings} then e.data else null end as embedding, e.content_hash
            from knowledge_sources s left join knowledge_embeddings e on e.source_id = s.id
            order by s.sort_order, s.title`,
        listReservedComponents(),
    ]);
    return rows.map((row) => {
        const source = decodeSource(row);
        const current = row.content_hash === embeddingHash(effectivePublishedSource(source, components));
        const searchStatus = source.status !== "published" ? "Excluded" : current ? "Indexed" : "Needs indexing";
        return { ...source, searchStatus };
    });
}

export const listPublishedKnowledge = unstable_cache(async () => {
    await ensureKnowledgeSchema();
    const [rows, components] = await Promise.all([
        sql`select s.*, e.data as embedding from knowledge_sources s
            left join knowledge_embeddings e on e.source_id=s.id where s.status='published'
            order by s.sort_order,s.title`,
        listReservedComponents(),
    ]);
    return rows.map((row) => effectivePublishedSource(decodeSource(row), components));
}, ["dedicated-published-knowledge-v2"], { tags: ["profile-knowledge", "reserved-components"], revalidate: 300 });

export async function getKnowledgeSource(id: string): Promise<KnowledgeSource | null> {
    await ensureKnowledgeSchema();
    const rows = await sql`select s.*, e.data as embedding from knowledge_sources s
        left join knowledge_embeddings e on e.source_id=s.id where s.id=${id}`;
    return rows[0] ? decodeSource(rows[0]) : null;
}

export async function saveKnowledgeSource(input: KnowledgeSource) {
    const source = KnowledgeSourceSchema.parse(input);
    await saveKnowledgeSources([source]);
    return source;
}

export async function archiveKnowledgeSource(id: string) {
    await setKnowledgeVisibility([id], "draft");
}

export async function setKnowledgeVisibility(ids: string[], status: "draft" | "published") {
    await ensureKnowledgeSchema();
    await sql`update knowledge_sources set status=${status}, updated_at=now() where id=any(${ids}::text[])`;
}

export async function saveKnowledgeEmbedding(source: KnowledgeSource, embedding: SourceEmbedding) {
    await ensureKnowledgeSchema();
    const rows = await sql`insert into knowledge_embeddings(source_id,content_hash,data)
        select id,${embedding.hash},${JSON.stringify(embedding)}::jsonb from knowledge_sources
        where id=${source.id} and status='published' and body=${source.text} and title=${source.title}
            and kind=${source.kind} and keywords=${JSON.stringify(source.keywords)}::jsonb
        on conflict(source_id) do update set content_hash=excluded.content_hash,data=excluded.data,updated_at=now()
        returning source_id`;
    if (!rows.length) throw new Error("Source changed while indexing.");
}

export async function saveKnowledgeSources(input: KnowledgeSource[]) {
    const sources = input.map((source) => KnowledgeSourceSchema.parse(source));
    await ensureKnowledgeSchema();
    await sql`insert into knowledge_sources(id,title,body,url,keywords,kind,status,origin,repository)
        select source->>'id',source->>'title',source->>'text',source->>'url',source->'keywords',
            source->>'kind',source->>'status',source->>'origin',nullif(source->'repository','null'::jsonb)
        from jsonb_array_elements(${JSON.stringify(sources)}::jsonb) as source
        on conflict(id) do update set title=excluded.title,body=excluded.body,url=excluded.url,
            keywords=excluded.keywords,kind=excluded.kind,status=excluded.status,origin=excluded.origin,
            repository=excluded.repository,updated_at=now()`;
}
