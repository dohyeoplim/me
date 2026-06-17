"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, Reorder, useDragControls } from "motion/react";
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

    useEffect(() => {
        if (!openSlot) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Element | null;
            if (target?.closest("[data-add-picker]")) return;
            setOpenSlot(null);
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [openSlot]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelected(null);
                setOpenSlot(null);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const selectBlock = (id: string) => {
        setSelected(id);
        setOpenSlot(null);
    };

    const setBlocks = (next: Block[]) => onChange({ ...doc, blocks: next });

    const insertAt = (index: number, type: BlockType) => {
        const block = createBlock(type);
        const next = [...blocks];
        next.splice(index, 0, block);
        setBlocks(next);
        setSelected(block.id);
        setOpenSlot(null);
    };

    const insertAfter = (afterId: string, type: BlockType) =>
        insertAt(blocks.findIndex((b) => b.id === afterId) + 1, type);

    const updateBlock = (b: Block) =>
        setBlocks(blocks.map((x) => (x.id === b.id ? b : x)));

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter((x) => x.id !== id));
        if (selected === id) setSelected(null);
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
                <Reorder.Group
                    as="div"
                    axis="y"
                    values={blocks}
                    onReorder={setBlocks}
                >
                    <AnimatePresence initial={false}>
                        {blocks.map((block) => (
                            <BlockRow
                                key={block.id}
                                block={block}
                                selected={selected === block.id}
                                pickerOpen={openSlot === block.id}
                                onSelect={() => selectBlock(block.id)}
                                onDeselect={() => setSelected(null)}
                                onChange={updateBlock}
                                onRemove={() => removeBlock(block.id)}
                                onAdd={(t) => insertAfter(block.id, t)}
                                onPickerOpenChange={(o) =>
                                    setOpenSlot(o ? block.id : null)
                                }
                            />
                        ))}
                    </AnimatePresence>
                </Reorder.Group>
            </div>
        </section>
    );
}

type BlockRowProps = {
    block: Block;
    selected: boolean;
    pickerOpen: boolean;
    onSelect: () => void;
    onDeselect: () => void;
    onChange: (block: Block) => void;
    onRemove: () => void;
    onAdd: (type: BlockType) => void;
    onPickerOpenChange: (open: boolean) => void;
};

function BlockRow({
    block,
    selected,
    pickerOpen,
    onSelect,
    onDeselect,
    onChange,
    onRemove,
    onAdd,
    onPickerOpenChange,
}: BlockRowProps) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            as="div"
            value={block}
            dragListener={false}
            dragControls={controls}
            layout="position"
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{
                opacity: 1,
                height: "auto",
                transitionEnd: { overflow: "visible" },
            }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
        >
            <BlockEditable
                block={block}
                selected={selected}
                dragControls={controls}
                onSelect={onSelect}
                onDeselect={onDeselect}
                onChange={onChange}
                onRemove={onRemove}
            />
            <GhostSlot
                onAdd={onAdd}
                open={pickerOpen}
                onOpenChange={onPickerOpenChange}
            />
        </Reorder.Item>
    );
}
