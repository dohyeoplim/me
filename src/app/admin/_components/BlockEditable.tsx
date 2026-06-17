"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Block, BlockStyle } from "@/app/lib/content/schema";
import BlockRenderer from "@/app/components/ContentRenderer/BlockRenderer";
import { BLOCK_LABELS } from "./blockFactory";
import BlockFields from "./BlockFields";
import StyleControls from "./StyleControls";

const hasStyle = (b: Block) => b.type !== "divider" && b.type !== "spacer";

function isEmpty(b: Block): boolean {
    switch (b.type) {
        case "text":
        case "heading":
            return b.text.trim() === "";
        case "item":
            return b.title.trim() === "";
        case "project":
            return b.name.trim() === "";
        case "enumerate":
            return b.items.every((i) => i.trim() === "");
        case "section":
            return (b.label ?? "").trim() === "" && b.content.length === 0;
        default:
            return false;
    }
}

type Props = {
    block: Block;
    selected: boolean;
    isFirst: boolean;
    isLast: boolean;
    onSelect: () => void;
    onDeselect: () => void;
    onChange: (block: Block) => void;
    onRemove: () => void;
    onMove: (dir: -1 | 1) => void;
};

export default function BlockEditable(props: Props) {
    const { block, selected, isFirst, isLast } = props;
    const [showStyle, setShowStyle] = useState(false);

    return (
        <AnimatePresence initial={false} mode="wait">
            {!selected ? (
                <motion.div
                    key="view"
                    initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                    animate={{
                        opacity: 1,
                        height: "auto",
                        transitionEnd: { overflow: "visible" },
                    }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative -mx-2 rounded-md px-2 py-1.5 hover:bg-grey-100"
                >
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={props.onSelect}
                        className="cursor-text"
                    >
                        {isEmpty(block) ? (
                            <span className="font-body03-light text-grey-300">
                                Empty {BLOCK_LABELS[block.type]} — click to edit
                            </span>
                        ) : (
                            <BlockRenderer block={block} />
                        )}
                    </div>
                    <div className="absolute -top-3 right-0 hidden items-center gap-3 rounded-md border border-grey-200 bg-grey-50 px-2 py-1 font-body04-light text-grey-500 group-hover:flex">
                        <button
                            type="button"
                            disabled={isFirst}
                            className="disabled:opacity-30"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onMove(-1);
                            }}
                        >
                            ↑
                        </button>
                        <button
                            type="button"
                            disabled={isLast}
                            className="disabled:opacity-30"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onMove(1);
                            }}
                        >
                            ↓
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onRemove();
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="edit"
                    initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                    animate={{
                        opacity: 1,
                        height: "auto",
                        transitionEnd: { overflow: "visible" },
                    }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="relative -mx-2 flex flex-col gap-3 rounded-md border border-grey-300 bg-grey-50 px-3 py-3"
                >
                    <div className="flex items-center justify-between">
                        <span className="font-caption01-light text-grey-400">
                            {BLOCK_LABELS[block.type]}
                        </span>
                        <div className="flex items-center gap-3 font-body04-light text-grey-500">
                            <button
                                type="button"
                                disabled={isFirst}
                                className="disabled:opacity-30"
                                onClick={() => props.onMove(-1)}
                            >
                                ↑
                            </button>
                            <button
                                type="button"
                                disabled={isLast}
                                className="disabled:opacity-30"
                                onClick={() => props.onMove(1)}
                            >
                                ↓
                            </button>
                            {hasStyle(block) && (
                                <button
                                    type="button"
                                    onClick={() => setShowStyle((s) => !s)}
                                >
                                    Style
                                </button>
                            )}
                            <button type="button" onClick={props.onRemove}>
                                Delete
                            </button>
                            <button
                                type="button"
                                className="text-grey-800"
                                onClick={props.onDeselect}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                    <BlockFields block={block} onChange={props.onChange} />
                    {hasStyle(block) && showStyle && (
                        <StyleControls
                            style={block.style}
                            onChange={(s: BlockStyle) =>
                                props.onChange({ ...block, style: s })
                            }
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
