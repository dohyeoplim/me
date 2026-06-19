"use client";

import type { SectionNode } from "@/app/lib/content/schema";
import { createNode, type NodeType } from "./blockFactory";
import { TextInput, TextArea } from "../shared/Field";

const NODE_TYPES: NodeType[] = ["item", "enumerate", "spacer"];

type Props = {
    nodes: SectionNode[];
    onChange: (nodes: SectionNode[]) => void;
};

export default function SectionNodeFields({ nodes, onChange }: Props) {
    const update = (i: number, node: SectionNode) =>
        onChange(nodes.map((n, idx) => (idx === i ? node : n)));
    const remove = (i: number) => onChange(nodes.filter((_, idx) => idx !== i));
    const move = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= nodes.length) return;
        const next = [...nodes];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };

    return (
        <div className="flex flex-col gap-3 border-l border-grey-200 pl-3">
            {nodes.map((node, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="font-caption01-light text-grey-400">
                            {node.type}
                        </span>
                        <div className="flex gap-2 font-body04-light text-grey-500">
                            <button type="button" onClick={() => move(i, -1)}>
                                ↑
                            </button>
                            <button type="button" onClick={() => move(i, 1)}>
                                ↓
                            </button>
                            <button type="button" onClick={() => remove(i)}>
                                ✕
                            </button>
                        </div>
                    </div>
                    {node.type === "item" && (
                        <>
                            <TextInput
                                label="title"
                                value={node.title}
                                onChange={(v) => update(i, { ...node, title: v })}
                            />
                            <TextArea
                                label="subtitle"
                                value={node.subtitle ?? ""}
                                onChange={(v) =>
                                    update(i, { ...node, subtitle: v })
                                }
                            />
                            <TextInput
                                label="meta"
                                value={node.meta ?? ""}
                                onChange={(v) => update(i, { ...node, meta: v })}
                            />
                        </>
                    )}
                    {node.type === "enumerate" && (
                        <TextArea
                            label="items (one per line)"
                            value={node.items.join("\n")}
                            onChange={(v) =>
                                update(i, { ...node, items: v.split("\n") })
                            }
                        />
                    )}
                    {node.type === "spacer" && (
                        <TextInput
                            label="size"
                            value={String(node.size ?? "")}
                            onChange={(v) => update(i, { ...node, size: v })}
                        />
                    )}
                </div>
            ))}
            <div className="flex flex-wrap gap-2">
                {NODE_TYPES.map((t) => (
                    <button
                        key={t}
                        type="button"
                        className="rounded-md border border-grey-200 px-2 py-1 font-body04-light text-grey-600"
                        onClick={() => onChange([...nodes, createNode(t)])}
                    >
                        + {t}
                    </button>
                ))}
            </div>
        </div>
    );
}
