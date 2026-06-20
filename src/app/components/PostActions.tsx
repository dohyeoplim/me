"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Layers, X } from "lucide-react";

export type RelatedPost = {
    slug: string;
    title: string;
    description: string;
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
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40 bg-grey-900/10"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-6"
                    >
                        <motion.div
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 34,
                            }}
                            className={
                                open
                                    ? "w-full max-w-xl overflow-hidden rounded-2xl border border-grey-200 bg-grey-50/90 shadow-lg backdrop-blur"
                                    : "overflow-hidden rounded-full border border-grey-200 bg-grey-50/60 p-1 shadow-sm backdrop-blur"
                            }
                        >
                            {open ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2, delay: 0.05 }}
                                    className="flex flex-col"
                                >
                                    <div className="flex items-center justify-between p-1">
                                        <Link
                                            href="/blog"
                                            transitionTypes={["nav-back"]}
                                            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body04-light text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                                        >
                                            <ArrowLeft
                                                size={15}
                                                strokeWidth={1.75}
                                            />
                                            Go back
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body04-light text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                                        >
                                            <X size={15} strokeWidth={1.75} />
                                            Close
                                        </button>
                                    </div>
                                    <ul className="flex max-h-[55vh] flex-col divide-y divide-grey-200 overflow-y-auto border-t border-grey-200 px-4 pb-4 pt-1">
                                        {related.map((post) => (
                                            <li key={post.slug}>
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    transitionTypes={[
                                                        "nav-forward",
                                                    ]}
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                    className="group flex flex-col gap-1 py-3"
                                                >
                                                    <span className="font-body02-light text-grey-900 transition-colors group-hover:text-grey-600">
                                                        {post.title}
                                                    </span>
                                                    {post.description && (
                                                        <span className="line-clamp-2 font-body04-light text-grey-500">
                                                            {post.description}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ) : (
                                <motion.div className="flex items-center gap-1">
                                    <Link
                                        href="/blog"
                                        transitionTypes={["nav-back"]}
                                        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body04-light text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                                    >
                                        <ArrowLeft
                                            size={15}
                                            strokeWidth={1.75}
                                        />
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
                                                <Layers
                                                    size={15}
                                                    strokeWidth={1.75}
                                                />
                                                Related
                                            </button>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
