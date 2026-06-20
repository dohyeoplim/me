"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function BackToList() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 320);
        const id = requestAnimationFrame(onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-6 left-6 z-40"
                >
                    <Link
                        href="/blog"
                        transitionTypes={["nav-back"]}
                        className="flex items-center gap-1.5 rounded-full border border-grey-200 bg-grey-50/80 px-4 py-2 font-body04-light text-grey-500 shadow-sm backdrop-blur transition-colors hover:text-grey-900"
                    >
                        <ArrowLeft size={15} strokeWidth={1.75} />
                        Writing
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
