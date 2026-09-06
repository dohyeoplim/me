import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const ids = args.filter((argument) => argument !== "--apply");
if (!ids.length || ids.some((id) => id.startsWith("--"))) {
    throw new Error("Usage: node scripts/sync-portfolio-knowledge.mjs [--apply] source-id ...");
}
process.loadEnvFile(".env.local");
const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "portfolio-knowledge-sync-"));

try {
    const compiled = spawnSync(process.execPath, [require.resolve("typescript/lib/tsc.js"),
        "src/app/lib/knowledge/portfolio-sync.ts", "src/app/lib/knowledge/embeddings.ts",
        "--outDir", output, "--module", "commonjs", "--target", "es2022", "--strict",
        "--esModuleInterop", "--skipLibCheck", "--types", "node",
    ], { stdio: "inherit" });
    if (compiled.status !== 0) throw new Error("Portfolio sync compilation failed.");
    process.env.NODE_PATH = join(process.cwd(), "node_modules");
    require("node:module").Module._initPaths();
    const { planPortfolioSync } = require(join(output, "lib/knowledge/portfolio-sync.js"));
    const { KnowledgeSourceSchema } = require(join(output, "lib/knowledge/schema.js"));
    const { embedSource, embeddingHash } = require(join(output, "lib/knowledge/embeddings.js"));
    const { effectivePublishedSource } = require(join(output, "lib/knowledge/sources.js"));
    const { defaultReservedComponents, ReservedComponentSchema } = require(join(output,
        "lib/reserved-components/schema.js"));
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`select s.*, s.updated_at::text as snapshot_time, e.data as embedding,
        e.content_hash, e.updated_at::text as embedding_time from knowledge_sources s
        left join knowledge_embeddings e on e.source_id = s.id where s.id = any(${ids}::text[])`;
    const existing = rows.map((row) => KnowledgeSourceSchema.parse({ ...row, text: row.body,
        repository: row.repository ?? undefined, embedding: row.embedding ?? undefined }));
    const { updates, skipped } = planPortfolioSync(existing, ids);
    console.log(JSON.stringify({ apply, updates: updates.map(({ source, fields }) => ({ id: source.id, fields })),
        skipped }, null, 2));
    if (apply && updates.length) {
        const componentRows = await sql`select id, enabled, source_ids, presentation, updated_at::text as version
            from reserved_components order by id`;
        const saved = new Map(componentRows.map((row) => [row.id,
            ReservedComponentSchema.parse({ ...row, sourceIds: row.source_ids })]));
        const components = defaultReservedComponents.map((component) => saved.get(component.id) ?? component);
        let indexed = 0;
        const sources = await Promise.all(updates.map(async ({ source }) => {
            const effective = effectivePublishedSource(source, components);
            if (source.embedding?.hash === embeddingHash(effective)) return source;
            indexed++;
            return { ...source, embedding: await embedSource(effective) };
        }));
        const changedIds = sources.map(({ id }) => id);
        const snapshotRows = rows.filter(({ id }) => changedIds.includes(id));
        const snapshot = `sync-${crypto.randomUUID()}`;
        await sql.transaction([
            sql`select 1 / case when count(*) = ${snapshotRows.length} then 1 else 0 end as unchanged
                from knowledge_sources s left join knowledge_embeddings e on e.source_id = s.id
                join jsonb_array_elements(${JSON.stringify(snapshotRows)}::jsonb) expected on s.id = expected->>'id'
                where s.updated_at::text = expected->>'snapshot_time'
                    and e.updated_at::text is not distinct from expected->>'embedding_time'`,
            sql`select 1 / case when coalesce(jsonb_agg(to_jsonb(component) order by component.id), '[]'::jsonb) =
                ${JSON.stringify(componentRows)}::jsonb then 1 else 0 end as components_unchanged
                from (select id, enabled, source_ids, presentation, updated_at::text as version
                    from reserved_components order by id) component`,
            sql`insert into knowledge_snapshots (id, description, data)
                values (${snapshot}, 'Before selected portfolio knowledge sync',
                    ${JSON.stringify(snapshotRows)}::jsonb)`,
            sql`update knowledge_sources s set title = source->>'title', body = source->>'text',
                url = source->>'url', keywords = source->'keywords', kind = source->>'kind', updated_at = now()
                from jsonb_array_elements(${JSON.stringify(sources)}::jsonb) source where s.id = source->>'id'`,
            sql`insert into knowledge_embeddings (source_id, content_hash, data)
                select source->>'id', source->'embedding'->>'hash', source->'embedding'
                from jsonb_array_elements(${JSON.stringify(sources)}::jsonb) source
                on conflict(source_id) do update set content_hash = excluded.content_hash,
                    data = excluded.data, updated_at = now()`,
        ], { isolationLevel: "Serializable" });
        console.log(JSON.stringify({ updated: changedIds, indexed, snapshot, preservedVisibility: true }));
    }
} finally {
    rmSync(output, { recursive: true, force: true });
}
