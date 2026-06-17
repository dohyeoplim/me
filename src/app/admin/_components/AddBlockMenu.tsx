"use client";

import type { BlockType } from "@/app/lib/content/schema";
import { BLOCK_LABELS, BLOCK_ORDER } from "./blockFactory";

type Props = {
    onAdd: (type: BlockType) => void;
};

export default function AddBlockMenu({ onAdd }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {BLOCK_ORDER.map((type) => (
                <button
                    key={type}
                    type="button"
                    className="rounded border border-grey-200 bg-white px-3 py-1.5 text-sm text-grey-700"
                    onClick={() => onAdd(type)}
                >
                    + {BLOCK_LABELS[type]}
                </button>
            ))}
        </div>
    );
}
