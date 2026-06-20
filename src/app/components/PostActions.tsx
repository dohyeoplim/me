"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Layers, X } from "lucide-react";
import { formatDate } from "@/app/lib/format";
import type { PostKind } from "@/app/lib/content/schema";

export type RelatedPost = {
    slug: string;
    title: string;
    kind: PostKind;
    date: string;
};

const KIND_LABEL: Record<PostKind, string> = {
    "paper-review": "Paper Review",
    seminar: "Seminar",
    note: "Note",
};

export default function PostActions({ related }: { related: RelatedPost[] }) {
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 320);
        const id = requestAnimationFrame(onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 bottom-6 z-40 flex justify-center"
                    >
                        <div className="flex items-center gap-1 rounded-full border border-grey-200 bg-grey-50/80 p-1 shadow-sm backdrop-blur">
                            <Link
                                href="/blog"
                                transitionTypes={["nav-back"]}
                                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body04-light text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                            >
                                <ArrowLeft size={15} strokeWidth={1.75} />
                                Go back
                            </Link>
                            {related.length > 0 && (
                                <>
                                    <span className="h-4 w-px bg-grey-200" />
                                    <button
                                        type="button"
                                        onClick={() => setOpen(true)}
                                        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body04-light text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                                    >
                                        <Layers size={15} strokeWidth={1.75} />
                                        Related
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-40 bg-grey-900/20"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{
                                type: "spring",
                                stiffness: 360,
                                damping: 34,
                            }}
                            className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
                        >
                            <div className="w-full max-w-2xl rounded-t-2xl border border-grey-200 bg-grey-50 px-6 pb-8 pt-5 shadow-lg">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="font-caption01-light text-grey-400">
                                        Related
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="rounded-md p-1 text-grey-400 transition-colors hover:bg-grey-100 hover:text-grey-700"
                                    >
                                        <X size={16} strokeWidth={1.75} />
                                    </button>
                                </div>
                                <ul className="flex flex-col divide-y divide-grey-200">
                                    {related.map((post) => (
                                        <li key={post.slug}>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                transitionTypes={["nav-forward"]}
                                                onClick={() => setOpen(false)}
                                                className="group flex flex-col gap-1 py-3"
                                            >
                                                <div className="flex items-center gap-2 font-caption01-light text-grey-400">
                                                    <span>
                                                        {KIND_LABEL[post.kind]}
                                                    </span>
                                                    {post.date && (
                                                        <span>
                                                            {formatDate(
                                                                post.date,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-body02-light text-grey-900 transition-colors group-hover:text-grey-600">
                                                    {post.title}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
