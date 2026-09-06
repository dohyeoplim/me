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
        "src/app/lib/reserved-components/repository.ts",
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
    const { listReservedComponents } = require(join(output, "lib/reserved-components/repository.js"));
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`select s.*, s.updated_at::text as snapshot_time, e.data as embedding
        from knowledge_sources s left join knowledge_embeddings e on e.source_id=s.id order by s.sort_order,s.title`;
    const existing = rows.map((row) => KnowledgeSourceSchema.parse({ ...row, text: row.body,
        cardId: null, repository: row.repository ?? undefined, embedding: row.embedding ?? undefined }));
    const components = await listReservedComponents();
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
                const effective = effectivePublishedSource(source, components);
                if (source.embedding?.hash !== embeddingHash(effective)) {
                    source.embedding = await embedSource(effective);
                }
                indexed++;
            }));
        }
        const snapshot = crypto.randomUUID();
        await sql.transaction([
            sql`select 1 / case when count(*) = ${rows.length} then 1 else 0 end as unchanged
                from knowledge_sources as entry
                join jsonb_array_elements(${JSON.stringify(rows)}::jsonb) as expected
                    on entry.id = expected->>'id'
                where entry.updated_at::text = expected->>'snapshot_time'`,
            sql`insert into knowledge_snapshots (id, description, data)
                values (${snapshot}, 'Before portfolio knowledge curation', ${JSON.stringify(rows)}::jsonb)`,
            sql`update knowledge_sources set status = 'draft', updated_at = now()
                where id = any(${excluded.map(({ id }) => id)}::text[])`,
            sql`insert into knowledge_sources(id,title,body,url,keywords,kind,status,origin,repository,sort_order)
                select source->>'id',source->>'title',source->>'text',source->>'url',source->'keywords',
                    source->>'kind','published',source->>'origin',
                    nullif(source->'repository','null'::jsonb),position::int
                from jsonb_array_elements(${JSON.stringify(published)}::jsonb) with ordinality as item(source, position)
                on conflict(id) do update set title=excluded.title,body=excluded.body,url=excluded.url,
                    keywords=excluded.keywords,kind=excluded.kind,status=excluded.status,origin=excluded.origin,
                    repository=excluded.repository,sort_order=excluded.sort_order,updated_at=now()`,
            sql`insert into knowledge_embeddings(source_id,content_hash,data)
                select source->>'id',source->'embedding'->>'hash',source->'embedding'
                from jsonb_array_elements(${JSON.stringify(published)}::jsonb) as source
                on conflict(source_id) do update set content_hash=excluded.content_hash,
                    data=excluded.data,updated_at=now()`,
        ]);
        const counts = await sql`select status, count(*)::int as count from knowledge_sources group by status`;
        console.log(JSON.stringify({ snapshot, indexed, counts }));
    }
} finally {
    rmSync(output, { recursive: true, force: true });
}
