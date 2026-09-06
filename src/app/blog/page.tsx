import { Suspense } from "react";
import SlideTransition from "@/app/components/SlideTransition";
import { loadPosts } from "@/app/lib/contentLoader";
import BlogList, { type BlogListItem } from "./BlogList";
import { PostListSkeleton } from "./_components/WritingSkeleton";
import WritingHeader from "./_components/WritingHeader";

export const revalidate = 300;

export const metadata = {
    title: "Writing :: Dohyeop",
    description: "Paper reviews and research notes.",
};

async function PublishedPosts() {
    const posts = await loadPosts();
    const items: BlogListItem[] = posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        kind: post.doc.kind,
        date: post.doc.date,
        description: post.doc.description,
        tags: post.doc.tags,
    }));
    return <BlogList items={items} />;
}

export default function BlogIndex() {
    return (
        <SlideTransition>
            <div className="dds-container writing-page">
                <div className="writing-index">
                    <WritingHeader />

                    <Suspense fallback={<PostListSkeleton />}>
                        <PublishedPosts />
                    </Suspense>
                </div>
            </div>
        </SlideTransition>
    );
}
