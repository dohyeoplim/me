"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Layers } from "lucide-react";
import { useGoBack } from "./GoBack";

export type RelatedPost = {
    slug: string;
    title: string;
    description: string;
};

export default function PostActions({ related }: { related: RelatedPost[] }) {
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const goBack = useGoBack();

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
                        className="fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-6"
                    >
                        <AnimatePresence>
                            {open && related.length > 0 && (
                                <motion.div
                                    key="box"
                                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 420,
                                        damping: 34,
                                    }}
                                    style={{ transformOrigin: "bottom center" }}
                                    onClick={() => setOpen(false)}
                                    className="w-full max-w-md overflow-hidden rounded-2xl border border-grey-200 bg-grey-50/90 shadow-lg backdrop-blur"
                                >
                                    <ul className="flex max-h-[55vh] flex-col divide-y divide-grey-200 overflow-y-auto px-4 py-2">
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
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-1 rounded-full border border-grey-200 bg-grey-50/60 p-1 shadow-sm backdrop-blur">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body04-light text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                            >
                                <ArrowLeft size={15} strokeWidth={1.75} />
                                Go back
                            </button>
                            {related.length > 0 && (
                                <>
                                    <span className="h-4 w-px bg-grey-200" />
                                    <button
                                        type="button"
                                        onClick={() => setOpen((o) => !o)}
                                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body04-light transition-colors hover:bg-grey-100 hover:text-grey-900 ${
                                            open
                                                ? "bg-grey-100 text-grey-900"
                                                : "text-grey-500"
                                        }`}
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
        </>
    );
}
