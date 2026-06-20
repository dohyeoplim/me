import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadPost, loadPosts } from "@/app/lib/contentLoader";
import Markdown from "@/app/components/Markdown";
import PaperAbstract from "@/app/components/PaperAbstract";
import PostActions from "@/app/components/PostActions";
import GoBack from "@/app/components/GoBack";
import SlideTransition from "@/app/components/SlideTransition";
import { formatDate, readingTime } from "@/app/lib/format";
import { KIND_LABEL } from "@/app/lib/content/schema";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await loadPost(slug);
    if (!post || post.status !== "published") return {};
    return {
        title: `${post.title} :: Dohyeop Lim`,
        description: post.doc.summary || undefined,
    };
}

export default async function PostPage({ params }: { params: Params }) {
    const { slug } = await params;
    const post = await loadPost(slug);
    if (!post || post.status !== "published") notFound();

    const { doc } = post;

    const tags = new Set(doc.tags);
    const related = (await loadPosts(true))
        .filter((p) => p.slug !== post.slug)
        .map((p) => ({
            slug: p.slug,
            title: p.title,
            description: p.doc.description,
            date: p.doc.date,
            score:
                p.doc.tags.filter((t) => tags.has(t)).length * 2 +
                (p.doc.kind === doc.kind ? 1 : 0),
        }))
        .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
        .slice(0, 4);
    const hasPaper =
        doc.paper.title ||
        doc.paper.authors ||
        doc.paper.venue ||
        doc.paper.url;

    return (
        <SlideTransition>
            <div className="w-full max-w-4xl mx-auto px-6 pt-28 md:pt-40 pb-30">
                <article className="flex flex-col gap-10">
                <GoBack className="w-fit font-body04-light text-grey-400 transition-colors hover:text-grey-600">
                    ← Go back
                </GoBack>

            <header className="flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3 font-caption01-light text-grey-400">
                        <span>{KIND_LABEL[doc.kind]}</span>
                        {doc.date && <span>{formatDate(doc.date)}</span>}
                        <span>{readingTime(doc.body)} min read</span>
                    </div>

                    <h1 className="font-title02-light text-grey-900">
                        {post.title}
                    </h1>

                    {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {doc.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-grey-100 px-2.5 py-0.5 font-body05-light text-grey-500"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {(hasPaper || doc.summary) && (
                    <div className="flex flex-col gap-2 border-l-2 border-grey-200 pl-4">
                        {doc.paper.title &&
                            (doc.paper.url ? (
                                <a
                                    href={doc.paper.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-fit font-body02-regular text-grey-900 decoration-grey-300 underline-offset-2 hover:underline"
                                >
                                    {doc.paper.title}
                                </a>
                            ) : (
                                <span className="font-body02-regular text-grey-900">
                                    {doc.paper.title}
                                </span>
                            ))}
                        {doc.paper.authors && (
                            <span className="font-body03-regular text-grey-700">
                                {doc.paper.authors}
                            </span>
                        )}
                        {(doc.paper.venue || doc.paper.url) && (
                            <div className="flex flex-wrap items-center gap-x-2 font-body04-light text-grey-500">
                                {doc.paper.venue && (
                                    <span>{doc.paper.venue}</span>
                                )}
                                {doc.paper.venue && doc.paper.url && (
                                    <span className="text-grey-300">·</span>
                                )}
                                {doc.paper.url && (
                                    <a
                                        href={doc.paper.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-grey-700 underline decoration-grey-300 underline-offset-2 hover:decoration-grey-500"
                                    >
                                        {doc.paper.url.includes("arxiv.org")
                                            ? "arXiv ↗"
                                            : "Paper ↗"}
                                    </a>
                                )}
                            </div>
                        )}
                        {doc.summary && <PaperAbstract text={doc.summary} />}
                    </div>
                )}
            </header>

            {doc.cover?.url && (
                <Image
                    src={doc.cover.url}
                    alt={doc.cover.alt}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-auto w-full rounded-md"
                />
            )}

            <Markdown>{doc.body}</Markdown>
                </article>
            </div>
            <PostActions related={related} />
        </SlideTransition>
    );
}
