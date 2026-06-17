"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block, BlockStyle } from "@/app/lib/content/schema";
import { BLOCK_LABELS } from "./blockFactory";
import BlockFields from "./BlockFields";
import StyleControls from "./StyleControls";

type Props = {
    block: Block;
    onChange: (block: Block) => void;
    onDuplicate: () => void;
    onRemove: () => void;
};

const hasStyle = (b: Block) => b.type !== "divider" && b.type !== "spacer";

export default function BlockCard({
    block,
    onChange,
    onDuplicate,
    onRemove,
}: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col gap-3 rounded-lg border border-grey-200 bg-grey-50 p-3"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="cursor-grab text-grey-400"
                        {...attributes}
                        {...listeners}
                    >
                        ⠿
                    </button>
                    <span className="text-xs font-medium text-grey-600">
                        {BLOCK_LABELS[block.type]}
                    </span>
                </div>
                <div className="flex gap-2 text-xs text-grey-500">
                    <button type="button" onClick={onDuplicate}>
                        Duplicate
                    </button>
                    <button type="button" onClick={onRemove}>
                        Delete
                    </button>
                </div>
            </div>
            <BlockFields block={block} onChange={onChange} />
            {hasStyle(block) && (
                <StyleControls
                    style={block.style}
                    onChange={(s: BlockStyle) => onChange({ ...block, style: s })}
                />
            )}
        </div>
    );
}
