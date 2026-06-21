"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { formatDate } from "@/app/lib/format";
import { KIND_LABEL, type PostKind } from "@/app/lib/content/schema";

export type BlogListItem = {
    slug: string;
    title: string;
    kind: PostKind;
    date: string;
    description: string;
    tags: string[];
};

const PAGE = 10;

export default function BlogList({ items }: { items: BlogListItem[] }) {
    const [query, setQuery] = useState("");
    const [visible, setVisible] = useState(PAGE);
    const sentinel = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        if (terms.length === 0) return items;
        return items.filter((item) => {
            const haystack = [
                item.title,
                item.description,
                KIND_LABEL[item.kind],
                ...item.tags,
            ]
                .join(" ")
                .toLowerCase();
            return terms.every((t) => haystack.includes(t));
        });
    }, [items, query]);

    const shown = filtered.slice(0, visible);
    const hasMore = visible < filtered.length;

    useEffect(() => {
        if (!hasMore) return;
        const el = sentinel.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisible((v) => v + PAGE);
                }
            },
            { rootMargin: "400px 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore]);

    return (
        <div className="flex flex-col gap-6">
            <div className="relative">
                <Search
                    size={16}
                    strokeWidth={1.75}
                    className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-grey-400"
                />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setVisible(PAGE);
                    }}
                    placeholder="Search"
                    className="w-full border-b border-grey-200 bg-transparent py-2 pl-6 font-body02-light text-grey-900 outline-none transition-colors placeholder:text-grey-300 focus:border-grey-400"
                />
            </div>

            {shown.length === 0 ? (
                <p className="py-6 font-body02-light text-grey-400">
                    {items.length === 0
                        ? "No posts yet."
                        : "No matching posts."}
                </p>
            ) : (
                <ul className="flex flex-col divide-y divide-grey-200">
                    {shown.map((post) => (
                        <li key={post.slug}>
                            <Link
                                href={`/blog/${post.slug}`}
                                transitionTypes={["nav-forward"]}
                                className="group flex flex-col gap-2 py-6"
                            >
                                <div className="flex items-center gap-3 font-caption01-light text-grey-400">
                                    <span>{KIND_LABEL[post.kind]}</span>
                                    {post.date && (
                                        <span>{formatDate(post.date)}</span>
                                    )}
                                </div>
                                <h2 className="font-head01-medium text-grey-900 transition-colors group-hover:text-grey-600">
                                    {post.title}
                                </h2>
                                {post.description && (
                                    <p className="font-body02-light text-grey-500">
                                        {post.description}
                                    </p>
                                )}
                                {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {post.tags.map((tag) => (
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

            {hasMore && <div ref={sentinel} className="h-px" />}
        </div>
    );
}
