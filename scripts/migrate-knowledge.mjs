import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { neon } from "@neondatabase/serverless";

process.loadEnvFile(".env.local");
const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "knowledge-migration-"));
try {
    const compiled = spawnSync(process.execPath, [require.resolve("typescript/lib/tsc.js"),
        "src/app/lib/knowledge/database.ts", "--outDir", output, "--module", "commonjs", "--target", "es2022",
        "--esModuleInterop", "--skipLibCheck", "--types", "node",
    ], { stdio: "inherit" });
    if (compiled.status !== 0) throw new Error("Migration compilation failed.");
    process.env.NODE_PATH = join(process.cwd(), "node_modules");
    require("node:module").Module._initPaths();
    const { ensureKnowledgeSchema } = require(join(output, "knowledge/database.js"));
    const sql = neon(process.env.DATABASE_URL);
    const counts = await sql`select type, count(*)::int as count from content_entries
        where type in ('profile_knowledge', 'profile_knowledge_backup', 'profile_knowledge_settings') group by type`;
    console.log(JSON.stringify({ apply: process.argv.includes("--apply"), counts }));
    if (process.argv.includes("--apply")) {
        await ensureKnowledgeSchema();
        const migrated = await sql`select key from knowledge_settings where key = 'migration-v1'`;
        if (migrated.length) throw new Error("Knowledge has already been migrated.");
        const snapshot = `migration-${crypto.randomUUID()}`;
        await sql.transaction([
            sql`insert into knowledge_snapshots (id, description, data)
                select ${snapshot}, 'Before dedicated knowledge migration', jsonb_agg(to_jsonb(entry))
                from content_entries entry where type in
                    ('profile_knowledge', 'profile_knowledge_backup', 'profile_knowledge_settings')`,
            sql`insert into knowledge_sources
                (id, title, body, url, keywords, kind, status, origin, repository, sort_order, updated_at)
                select slug, title, doc->>'text', doc->>'url', doc->'keywords', doc->>'kind', status,
                    doc->>'origin', nullif(doc->'repository', 'null'::jsonb), order_index, updated_at
                from content_entries where type = 'profile_knowledge'`,
            sql`insert into knowledge_embeddings (source_id, content_hash, data)
                select slug, doc->'embedding'->>'hash', doc->'embedding' from content_entries
                where type = 'profile_knowledge' and doc ? 'embedding'`,
            sql`insert into reserved_components (id, enabled, source_ids, presentation)
                select doc->>'cardId', coalesce(bool_and((doc->'cardPresentation'->>'enabled')::boolean), true),
                    jsonb_agg(slug), (jsonb_agg(doc->'cardPresentation') filter(where doc ? 'cardPresentation'))->0
                from content_entries where type = 'profile_knowledge'
                    and doc->>'cardId' in ('profile','eact','mochicall','collog','wonnit','docfusionx')
                group by doc->>'cardId'`,
            sql`insert into knowledge_snapshots (id, description, data, created_at)
                select slug, title, doc, updated_at from content_entries where type = 'profile_knowledge_backup'
                on conflict(id) do nothing`,
            sql`select 1 / case when
                (select count(*) from knowledge_sources) =
                (select count(*) from content_entries where type = 'profile_knowledge') then 1 else 0 end as verified`,
            sql`insert into knowledge_settings (key, value) values ('seeded', 'true'), ('migration-v1', 'true')`,
        ], { isolationLevel: "Serializable" });
        console.log(JSON.stringify({ snapshot, sources: await sql`select status,count(*)::int as count
            from knowledge_sources group by status`, embeddings: await sql`select count(*)::int as count
            from knowledge_embeddings` }));
    }
} finally { rmSync(output, { recursive: true, force: true }); }
