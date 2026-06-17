"use client";

import { useState } from "react";
import type { BlockType } from "@/app/lib/content/schema";
import { BLOCK_LABELS, BLOCK_ORDER } from "./blockFactory";
import AutoHeight from "./AutoHeight";

type Props = {
    onAdd: (type: BlockType) => void;
    prominent?: boolean;
};

export default function GhostSlot({ onAdd, prominent = false }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <AutoHeight>
            {open ? (
                <div className="my-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-grey-300 bg-grey-100 p-3">
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
                </div>
            ) : prominent ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="my-1 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-grey-300 py-3 font-caption01-light text-grey-400 hover:border-grey-400 hover:text-grey-600"
                >
                    + Add content
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="group flex h-11 w-full items-center"
                >
                    <span className="flex w-full items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="h-px flex-1 bg-grey-200" />
                        <span className="font-caption01-light text-grey-400">
                            + Add
                        </span>
                        <span className="h-px flex-1 bg-grey-200" />
                    </span>
                </button>
            )}
        </AutoHeight>
    );
}
