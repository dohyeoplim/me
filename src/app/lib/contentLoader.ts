import { unstable_cache } from "next/cache";
import { sql, ensureSchema } from "@/app/lib/db";
import { getIntro, listPosts, getPost } from "@/app/lib/content/repository";
import { toEntry, type Row } from "@/app/lib/content/row";
import { INTRO_DEFAULT } from "@/app/lib/content/schema";
import type { Entry, IntroDoc, Post } from "@/app/lib/content/schema";

export const loadEntriesByType = (
    type: string,
    publishedOnly = false,
): Promise<Entry[]> =>
    unstable_cache(
        async () => {
            await ensureSchema();
            const rows = (await (publishedOnly
                ? sql`
                    select * from content_entries
                    where type = ${type} and status = 'published'
                    order by order_index asc, slug asc
                `
                : sql`
                    select * from content_entries
                    where type = ${type}
                    order by order_index asc, slug asc
                `)) as Row[];
            return rows.map(toEntry);
        },
        ["content-list", type, publishedOnly ? "published" : "all"],
        { tags: ["content", `content:${type}`] },
    )();

export const loadIntro = (): Promise<IntroDoc> =>
    unstable_cache(
        async () => (await getIntro()) ?? INTRO_DEFAULT,
        ["content-intro"],
        { tags: ["content", "content:intro"] },
    )();

export const loadPosts = (publishedOnly = false): Promise<Post[]> =>
    unstable_cache(
        async () => {
            const posts = await listPosts();
            return publishedOnly
                ? posts.filter((p) => p.status === "published")
                : posts;
        },
        ["content-posts", publishedOnly ? "published" : "all"],
        { tags: ["content", "content:post"] },
    )();

export const loadPost = (slug: string): Promise<Post | null> =>
    unstable_cache(async () => getPost(slug), ["content-post", slug], {
        tags: ["content", "content:post"],
    })();
