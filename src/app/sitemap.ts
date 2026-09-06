import type { MetadataRoute } from "next";
import { loadPosts } from "./lib/contentLoader";
import { site } from "./lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await loadPosts();
    return [
        ...["", "/portfolio", "/blog", "/design-system"].map((path) => ({ url: `${site.url}${path}` })),
        ...posts.map(({ slug, updatedAt }) => ({
            url: `${site.url}/blog/${encodeURIComponent(slug)}`,
            lastModified: updatedAt,
        })),
    ];
}
