import Link from "next/link";
import SlideTransition from "@/app/components/SlideTransition";
import { loadPosts } from "@/app/lib/contentLoader";
import { formatDate } from "@/app/lib/format";
import type { PostKind } from "@/app/lib/content/schema";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Writing — Dohyeop Lim",
    description: "Paper reviews and seminar notes.",
};

const KIND_LABEL: Record<PostKind, string> = {
    "paper-review": "Paper Review",
    seminar: "Seminar",
    note: "Note",
};

export default async function BlogIndex() {
    const posts = await loadPosts(true);

    return (
        <SlideTransition>
            <div className="flex flex-col gap-12">
                <header className="flex flex-col gap-2">
                    <h1 className="font-title01-light text-grey-900">Writing</h1>
                    <p className="font-body01-light text-grey-500">
                        Paper reviews and seminar notes.
                    </p>
                </header>

                {posts.length === 0 ? (
                    <p className="font-body02-light text-grey-400">
                        No posts yet.
                    </p>
                ) : (
                    <ul className="flex flex-col divide-y divide-grey-200">
                        {posts.map((post) => (
                            <li key={post.id}>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    transitionTypes={["nav-forward"]}
                                    className="group flex flex-col gap-2 py-6"
                                >
                                    <div className="flex items-center gap-3 font-caption01-light text-grey-400">
                                        <span>{KIND_LABEL[post.doc.kind]}</span>
                                        {post.doc.date && (
                                            <span>
                                                {formatDate(post.doc.date)}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="font-head01-medium text-grey-900 transition-colors group-hover:text-grey-600">
                                        {post.title}
                                    </h2>
                                    {post.doc.description && (
                                        <p className="font-body02-light text-grey-500">
                                            {post.doc.description}
                                        </p>
                                    )}
                                    {post.doc.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {post.doc.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-grey-100 px-2.5 py-0.5 font-body05-light text-grey-500"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </SlideTransition>
    );
}
