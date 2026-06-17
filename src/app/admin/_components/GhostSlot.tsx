"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { BlockType } from "@/app/lib/content/schema";
import { BLOCK_LABELS, BLOCK_ORDER } from "./blockFactory";

type Props = {
    onAdd: (type: BlockType) => void;
    prominent?: boolean;
};

const anim = {
    initial: { opacity: 0, height: 0, overflow: "hidden" },
    animate: {
        opacity: 1,
        height: "auto",
        transitionEnd: { overflow: "visible" },
    },
    exit: { opacity: 0, height: 0, overflow: "hidden" },
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

export default function GhostSlot({ onAdd, prominent = false }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <AnimatePresence initial={false} mode="wait">
            {open ? (
                <motion.div
                    key="picker"
                    {...anim}
                    className="my-1 flex flex-wrap items-center gap-2 rounded-md border border-dashed border-grey-300 bg-grey-50 p-2"
                >
                    {BLOCK_ORDER.map((type) => (
                        <button
                            key={type}
                            type="button"
                            className="rounded-md border border-grey-200 px-2.5 py-1 font-body04-light text-grey-700 hover:border-grey-400"
                            onClick={() => {
                                onAdd(type);
                                setOpen(false);
                            }}
                        >
                            {BLOCK_LABELS[type]}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="px-1 font-body04-light text-grey-400"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </button>
                </motion.div>
            ) : prominent ? (
                <motion.button
                    key="prominent"
                    {...anim}
                    type="button"
                    onClick={() => setOpen(true)}
                    className="my-1 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-grey-300 py-3 font-caption01-light text-grey-400 hover:border-grey-400 hover:text-grey-600"
                >
                    + Add content
                </motion.button>
            ) : (
                <motion.button
                    key="subtle"
                    {...anim}
                    type="button"
                    onClick={() => setOpen(true)}
                    className="group flex h-7 w-full items-center"
                >
                    <span className="flex w-full items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="h-px flex-1 bg-grey-200" />
                        <span className="font-caption01-light text-grey-400">
                            + Add
                        </span>
                        <span className="h-px flex-1 bg-grey-200" />
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
