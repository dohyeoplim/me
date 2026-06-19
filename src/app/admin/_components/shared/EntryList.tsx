"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Reorder, useDragControls } from "motion/react";
import type { Entry } from "@/app/lib/content/schema";
import { reorderEntries } from "../../actions";

type Props = {
    entries: Entry[];
    type: string;
};

export default function EntryList({ entries: initial, type }: Props) {
    const [entries, setEntries] = useState(initial);
    const [, startTransition] = useTransition();

    const persist = (ordered: Entry[]) =>
        startTransition(() => {
            reorderEntries(
                type,
                ordered.map((e) => e.id),
            );
        });

    if (entries.length === 0) {
        return (
            <p className="py-3 font-body04-light text-grey-400">
                No entries yet. Create one below.
            </p>
        );
    }

    return (
        <Reorder.Group
            as="ul"
            axis="y"
            values={entries}
            onReorder={setEntries}
            className="flex flex-col divide-y divide-grey-200"
        >
            {entries.map((entry) => (
                <EntryRow
                    key={entry.id}
                    entry={entry}
                    onDragEnd={() => persist(entries)}
                />
            ))}
        </Reorder.Group>
    );
}

function EntryRow({
    entry,
    onDragEnd,
}: {
    entry: Entry;
    onDragEnd: () => void;
}) {
    const controls = useDragControls();

    return (
        <Reorder.Item
            as="li"
            value={entry}
            dragListener={false}
            dragControls={controls}
            onDragEnd={onDragEnd}
            className="flex items-center justify-between bg-grey-50 py-3"
        >
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Drag to reorder"
                    onPointerDown={(e) => controls.start(e)}
                    className="cursor-grab touch-none select-none text-grey-400 active:cursor-grabbing"
                >
                    ⠿
                </button>
                <Link
                    href={`/admin/${entry.type}/${entry.slug}`}
                    className="font-body02-light text-grey-900"
                >
                    {entry.title}
                </Link>
            </div>
            <span className="font-body05-light text-grey-400">
                {entry.status}
            </span>
        </Reorder.Item>
    );
}
