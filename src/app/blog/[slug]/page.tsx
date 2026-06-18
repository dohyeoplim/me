import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadPost } from "@/app/lib/contentLoader";
import Markdown from "@/app/components/Markdown";
import { formatDate, readingTime } from "@/app/lib/format";
import type { PostKind } from "@/app/lib/content/schema";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

const KIND_LABEL: Record<PostKind, string> = {
    "paper-review": "Paper Review",
    seminar: "Seminar",
    note: "Note",
};

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await loadPost(slug);
    if (!post || post.status !== "published") return {};
    return {
        title: `${post.title} — Dohyeop Lim`,
        description: post.doc.summary || undefined,
    };
}

export default async function PostPage({ params }: { params: Params }) {
    const { slug } = await params;
    const post = await loadPost(slug);
    if (!post || post.status !== "published") notFound();

    const { doc } = post;
    const hasPaper =
        doc.paper.authors || doc.paper.venue || doc.paper.year || doc.paper.url;

    return (
        <article className="flex flex-col gap-10">
            <Link
                href="/blog"
                className="font-body04-light text-grey-400 transition-colors hover:text-grey-600"
            >
                ← Writing
            </Link>

            <header className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 font-caption01-light text-grey-400">
                    <span>{KIND_LABEL[doc.kind]}</span>
                    {doc.date && <span>{formatDate(doc.date)}</span>}
                    <span>{readingTime(doc.body)} min read</span>
                </div>

                <h1 className="font-title02-light text-grey-900">
                    {post.title}
                </h1>

                {doc.summary && (
                    <p className="font-body01-light text-grey-500">
                        {doc.summary}
                    </p>
                )}

                {hasPaper && (
                    <div className="flex flex-col gap-1 rounded-lg border border-grey-200 p-4 font-body03-light text-grey-600">
                        {doc.paper.authors && <span>{doc.paper.authors}</span>}
                        {(doc.paper.venue || doc.paper.year) && (
                            <span className="text-grey-500">
                                {[doc.paper.venue, doc.paper.year]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </span>
                        )}
                        {doc.paper.url && (
                            <a
                                href={doc.paper.url}
                                target="_blank"
                                rel="noreferrer"
                                className="break-all text-grey-900 underline decoration-grey-300 underline-offset-2 hover:decoration-grey-500"
                            >
                                {doc.paper.url}
                            </a>
                        )}
                    </div>
                )}

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
    );
}
