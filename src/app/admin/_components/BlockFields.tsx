"use client";

import type { Block } from "@/app/lib/content/schema";
import { TextInput, TextArea } from "./Field";
import SectionNodeFields from "./SectionNodeFields";
import ImageField from "./ImageField";

type Props = {
    block: Block;
    onChange: (block: Block) => void;
};

export default function BlockFields({ block, onChange }: Props) {
    switch (block.type) {
        case "text":
        case "heading":
            return (
                <TextArea
                    label="text"
                    value={block.text}
                    onChange={(v) => onChange({ ...block, text: v })}
                />
            );
        case "image":
            return (
                <ImageField
                    url={block.url}
                    alt={block.alt ?? ""}
                    onChange={(patch) => onChange({ ...block, ...patch })}
                />
            );
        case "spacer":
            return (
                <TextInput
                    label="size"
                    value={String(block.size ?? "")}
                    onChange={(v) => onChange({ ...block, size: v })}
                />
            );
        case "enumerate":
            return (
                <TextArea
                    label="items (one per line)"
                    value={block.items.join("\n")}
                    onChange={(v) =>
                        onChange({ ...block, items: v.split("\n") })
                    }
                />
            );
        case "item":
            return (
                <>
                    <TextInput
                        label="title"
                        value={block.title}
                        onChange={(v) => onChange({ ...block, title: v })}
                    />
                    <TextArea
                        label="subtitle"
                        value={block.subtitle ?? ""}
                        onChange={(v) => onChange({ ...block, subtitle: v })}
                    />
                    <TextInput
                        label="meta"
                        value={block.meta ?? ""}
                        onChange={(v) => onChange({ ...block, meta: v })}
                    />
                </>
            );
        case "project":
            return (
                <>
                    <TextInput
                        label="name"
                        value={block.name}
                        onChange={(v) => onChange({ ...block, name: v })}
                    />
                    <TextInput
                        label="year"
                        value={block.year ?? ""}
                        onChange={(v) => onChange({ ...block, year: v })}
                    />
                    <TextInput
                        label="tagline"
                        value={block.tagline ?? ""}
                        onChange={(v) => onChange({ ...block, tagline: v })}
                    />
                    <TextArea
                        label="description"
                        value={block.description ?? ""}
                        onChange={(v) => onChange({ ...block, description: v })}
                    />
                    <TextInput
                        label="meta"
                        value={block.meta ?? ""}
                        onChange={(v) => onChange({ ...block, meta: v })}
                    />
                </>
            );
        case "section":
            return (
                <>
                    <TextInput
                        label="label"
                        value={block.label ?? ""}
                        onChange={(v) => onChange({ ...block, label: v })}
                    />
                    <SectionNodeFields
                        nodes={block.content}
                        onChange={(content) => onChange({ ...block, content })}
                    />
                </>
            );
        default:
            return null;
    }
}
