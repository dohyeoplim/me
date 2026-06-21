import SlideTransition from "@/app/components/SlideTransition";
import { loadPosts } from "@/app/lib/contentLoader";
import BlogList, { type BlogListItem } from "./BlogList";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Writing :: Dohyeop",
    description: "Paper reviews and research notes.",
};

export default async function BlogIndex() {
    const posts = await loadPosts(true);
    const items: BlogListItem[] = posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        kind: post.doc.kind,
        date: post.doc.date,
        description: post.doc.description,
        tags: post.doc.tags,
    }));

    return (
        <SlideTransition>
            <div className="w-full max-w-4xl mx-auto px-6 pt-28 md:pt-40 pb-30">
                <div className="flex flex-col gap-12">
                    <header className="flex flex-col gap-2">
                        <h1 className="font-title01-light text-grey-900">
                            Writing
                        </h1>
                        <p className="font-body01-light text-grey-500">
                            Paper reviews and research notes.
                        </p>
                    </header>

                    <BlogList items={items} />
                </div>
            </div>
        </SlideTransition>
    );
}
