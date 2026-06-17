"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Block, BlockType, ContentDoc } from "@/app/lib/content/schema";
import { createBlock } from "./blockFactory";
import SectionTitleEditor from "./SectionTitleEditor";
import GhostSlot from "./GhostSlot";
import BlockEditable from "./BlockEditable";

type Props = {
    doc: ContentDoc;
    onChange: (doc: ContentDoc) => void;
};

export default function Canvas({ doc, onChange }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const [openSlot, setOpenSlot] = useState<string | null>(null);
    const blocks = doc.blocks;

    const setBlocks = (next: Block[]) => onChange({ ...doc, blocks: next });

    const insertAt = (index: number, type: BlockType) => {
        const block = createBlock(type);
        const next = [...blocks];
        next.splice(index, 0, block);
        setBlocks(next);
        setSelected(block.id);
        setOpenSlot(null);
    };

    const updateBlock = (b: Block) =>
        setBlocks(blocks.map((x) => (x.id === b.id ? b : x)));

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter((x) => x.id !== id));
        if (selected === id) setSelected(null);
    };

    const moveBlock = (id: string, dir: -1 | 1) => {
        const i = blocks.findIndex((x) => x.id === id);
        const j = i + dir;
        if (j < 0 || j >= blocks.length) return;
        const next = [...blocks];
        [next[i], next[j]] = [next[j], next[i]];
        setBlocks(next);
    };

    const setTitle = (v: { title: string; subtitle: string }) => {
        const has = v.title.trim() !== "" || v.subtitle.trim() !== "";
        onChange({
            ...doc,
            sectionTitle: has
                ? { title: v.title, subtitle: v.subtitle || undefined }
                : undefined,
        });
    };

    return (
        <section className="flex w-full flex-col gap-12 md:flex-row md:justify-between md:gap-0">
            <div className="md:w-1/4">
                <SectionTitleEditor
                    title={doc.sectionTitle?.title ?? ""}
                    subtitle={doc.sectionTitle?.subtitle ?? ""}
                    onChange={setTitle}
                />
            </div>
            <div className="flex w-full flex-col md:max-w-lg">
                <GhostSlot
                    onAdd={(t) => insertAt(0, t)}
                    prominent={blocks.length === 0}
                    open={openSlot === "start"}
                    onOpenChange={(o) => setOpenSlot(o ? "start" : null)}
                />
                <AnimatePresence initial={false}>
                    {blocks.map((block, i) => (
                        <motion.div
                            key={block.id}
                            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                            animate={{
                                opacity: 1,
                                height: "auto",
                                transitionEnd: { overflow: "visible" },
                            }}
                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                            transition={{
                                duration: 0.28,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="flex flex-col"
                        >
                            <BlockEditable
                                block={block}
                                selected={selected === block.id}
                                isFirst={i === 0}
                                isLast={i === blocks.length - 1}
                                onSelect={() => setSelected(block.id)}
                                onDeselect={() => setSelected(null)}
                                onChange={updateBlock}
                                onRemove={() => removeBlock(block.id)}
                                onMove={(dir) => moveBlock(block.id, dir)}
                            />
                            <GhostSlot
                                onAdd={(t) => insertAt(i + 1, t)}
                                open={openSlot === block.id}
                                onOpenChange={(o) =>
                                    setOpenSlot(o ? block.id : null)
                                }
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
