"use client";

import { useState } from "react";
import type { BlockType } from "@/app/lib/content/schema";
import { BLOCK_LABELS, BLOCK_ORDER } from "./blockFactory";

type Props = {
    onAdd: (type: BlockType) => void;
};

export default function GhostSlot({ onAdd }: Props) {
    const [open, setOpen] = useState(false);

    if (open) {
        return (
            <div className="my-1 flex flex-wrap items-center gap-2 rounded-md border border-dashed border-grey-300 bg-grey-50 p-2">
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
        );
    }

    return (
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex h-6 w-full items-center"
        >
            <span className="flex w-full items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="h-px flex-1 bg-grey-200" />
                <span className="font-caption01-light text-grey-400">+ Add</span>
                <span className="h-px flex-1 bg-grey-200" />
            </span>
        </button>
    );
}
