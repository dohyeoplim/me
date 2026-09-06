import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { neon } from "@neondatabase/serverless";

process.loadEnvFile(".env.local");
const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "knowledge-curation-"));
const apply = process.argv.includes("--apply");

try {
    const compiled = spawnSync(process.execPath, [require.resolve("typescript/lib/tsc.js"),
        "src/app/lib/knowledge/curation.ts", "src/app/lib/knowledge/github.ts", "src/app/lib/knowledge/embeddings.ts",
        "--outDir", output, "--module", "commonjs", "--target", "es2022", "--strict",
        "--esModuleInterop", "--skipLibCheck", "--types", "node",
    ], { stdio: "inherit" });
    if (compiled.status !== 0) throw new Error("Curation compilation failed.");
    process.env.NODE_PATH = join(process.cwd(), "node_modules");
    require("node:module").Module._initPaths();
    const { curatePortfolioSources } = require(join(output, "lib/knowledge/curation.js"));
    const { importGitHubRepository } = require(join(output, "lib/knowledge/github.js"));
    const { embedSource, embeddingHash } = require(join(output, "lib/knowledge/embeddings.js"));
    const { effectivePublishedSource } = require(join(output, "lib/knowledge/sources.js"));
    const { KnowledgeSourceSchema } = require(join(output, "lib/knowledge/schema.js"));
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`select *, updated_at::text as snapshot_time from content_entries
        where type = 'profile_knowledge' order by order_index, title`;
    const existing = rows.map(({ doc, status }) => KnowledgeSourceSchema.parse({ ...doc, status }));
    const additional = existing.some((source) => source.repository?.fullName === "DriverNet-Project/DriverNet")
        ? [] : [await importGitHubRepository("https://github.com/DriverNet-Project/DriverNet")];
    const { published, excluded } = curatePortfolioSources(existing, additional);
    console.log(JSON.stringify({ apply, before: rows.length, published: published.map(({ title }) => title),
        excluded: excluded.length,
        added: published.filter((source) => !existing.some(({ id }) => id === source.id)).length,
    }, null, 2));
    if (apply) {
        let indexed = 0;
        for (let offset = 0; offset < published.length; offset += 4) {
            await Promise.all(published.slice(offset, offset + 4).map(async (source) => {
                const effective = effectivePublishedSource(source);
                if (source.embedding?.hash !== embeddingHash(effective)) {
                    source.embedding = await embedSource(effective);
                }
                indexed++;
            }));
        }
        const snapshot = crypto.randomUUID();
        await sql.transaction([
            sql`select 1 / case when count(*) = ${rows.length} then 1 else 0 end as unchanged
                from content_entries as entry
                join jsonb_array_elements(${JSON.stringify(rows)}::jsonb) as expected
                    on entry.id = expected->>'id'
                where entry.updated_at::text = expected->>'snapshot_time' and entry.doc = expected->'doc'`,
            sql`insert into content_entries (id, type, slug, title, status, doc)
                values (${`knowledge-backup-${snapshot}`}, 'profile_knowledge_backup', ${snapshot},
                    'Before portfolio knowledge curation', 'draft', ${JSON.stringify(rows)}::jsonb)`,
            sql`update content_entries set status = 'draft',
                doc = jsonb_set(doc, '{status}', '"draft"'::jsonb), updated_at = now()
                where type = 'profile_knowledge' and slug = any(${excluded.map(({ id }) => id)}::text[])`,
            sql`insert into content_entries (id, type, slug, title, status, order_index, doc, updated_at)
                select 'profile-knowledge-' || (source->>'id'), 'profile_knowledge', source->>'id', source->>'title',
                    'published', position::int, source, now()
                from jsonb_array_elements(${JSON.stringify(published)}::jsonb) with ordinality as item(source, position)
                on conflict (type, slug) do update set title = excluded.title, status = excluded.status,
                    order_index = excluded.order_index, doc = excluded.doc, updated_at = now()`,
        ]);
        const counts = await sql`select status, count(*)::int as count from content_entries
            where type = 'profile_knowledge' group by status`;
        console.log(JSON.stringify({ snapshot, indexed, counts }));
    }
} finally {
    rmSync(output, { recursive: true, force: true });
}
