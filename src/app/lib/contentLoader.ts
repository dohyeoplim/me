import "server-only";
import { unstable_cache } from "next/cache";
import { sql, ensureSchema } from "@/app/lib/db";
import { toPost, type Row } from "@/app/lib/content/row";
import { INTRO_DEFAULT, IntroDocSchema, type IntroDoc, type Post } from "@/app/lib/content/schema";

const revalidate = 300;

export const loadIntro = unstable_cache(async (): Promise<IntroDoc> => {
    await ensureSchema();
    const [row] = await sql`
        select doc from content_entries
        where type = 'intro' and slug = 'main' and status = 'published'
        limit 1
    `;
    return row ? IntroDocSchema.parse(row.doc) : INTRO_DEFAULT;
}, ["published-intro"], { tags: ["content", "content:intro"], revalidate });

export const loadPosts = unstable_cache(async (): Promise<Post[]> => {
    await ensureSchema();
    const rows = await sql`
        select * from content_entries
        where type = 'post' and status = 'published'
        order by coalesce(doc->>'date', '') desc, updated_at desc
    ` as Row[];
    return rows.map(toPost);
}, ["published-posts"], { tags: ["content", "content:post"], revalidate });

export const loadPost = unstable_cache(async (slug: string): Promise<Post | null> => {
    await ensureSchema();
    const [row] = await sql`
        select * from content_entries
        where type = 'post' and slug = ${slug} and status = 'published'
        limit 1
    ` as Row[];
    return row ? toPost(row) : null;
}, ["published-post"], { tags: ["content", "content:post"], revalidate });
