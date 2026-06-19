"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

type Props = {
    src?: string;
    alt?: string;
};

export default function ZoomableImage({ src, alt }: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!src) return null;

    const layoutId = `zoom-${src}`;

    return (
        <span className="my-2 flex flex-col items-center gap-2">
            <motion.img
                layoutId={layoutId}
                src={src}
                alt={alt}
                onClick={() => setOpen(true)}
                className="m-0 h-auto max-w-full cursor-zoom-in rounded-md"
            />
            {alt && (
                <span className="text-center font-caption01-light text-grey-400">
                    {alt}
                </span>
            )}

            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setOpen(false)}
                                className="fixed inset-0 z-200 flex items-center justify-center bg-grey-900/80 p-6"
                            >
                                <motion.img
                                    layoutId={layoutId}
                                    src={src}
                                    alt={alt}
                                    className="max-h-[90vh] max-w-[90vw] cursor-zoom-out rounded-md object-contain"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </span>
    );
}
