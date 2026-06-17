"use client";

import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Block } from "@/app/lib/content/schema";
import BlockCard from "./BlockCard";

type Props = {
    blocks: Block[];
    onChange: (blocks: Block[]) => void;
};

export default function BlockList({ blocks, onChange }: Props) {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const from = blocks.findIndex((b) => b.id === active.id);
        const to = blocks.findIndex((b) => b.id === over.id);
        onChange(arrayMove(blocks, from, to));
    };

    const update = (block: Block) =>
        onChange(blocks.map((b) => (b.id === block.id ? block : b)));
    const remove = (id: string) => onChange(blocks.filter((b) => b.id !== id));
    const duplicate = (block: Block) => {
        const copy = { ...block, id: crypto.randomUUID() };
        const i = blocks.findIndex((b) => b.id === block.id);
        const next = [...blocks];
        next.splice(i + 1, 0, copy);
        onChange(next);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-3">
                    {blocks.map((block) => (
                        <BlockCard
                            key={block.id}
                            block={block}
                            onChange={update}
                            onDuplicate={() => duplicate(block)}
                            onRemove={() => remove(block.id)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
