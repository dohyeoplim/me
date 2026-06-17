import type { Block, BlockType, SectionNode } from "@/app/lib/content/schema";

export const BLOCK_LABELS: Record<BlockType, string> = {
    heading: "Heading",
    text: "Text",
    item: "Item",
    enumerate: "List",
    project: "Project",
    section: "Section",
    divider: "Divider",
    spacer: "Spacer",
};

export const BLOCK_ORDER: BlockType[] = [
    "heading",
    "text",
    "item",
    "enumerate",
    "project",
    "section",
    "divider",
    "spacer",
];

export function createBlock(type: BlockType): Block {
    const id = crypto.randomUUID();
    switch (type) {
        case "heading":
            return { id, type, text: "Heading" };
        case "text":
            return { id, type, text: "Text" };
        case "divider":
            return { id, type };
        case "spacer":
            return { id, type, size: 16 };
        case "section":
            return { id, type, label: "Label", content: [] };
        case "item":
            return { id, type, title: "Title" };
        case "enumerate":
            return { id, type, items: ["Item"] };
        case "project":
            return { id, type, name: "Project" };
    }
}

export type NodeType = SectionNode["type"];

export function createNode(type: NodeType): SectionNode {
    switch (type) {
        case "item":
            return { type, title: "Title" };
        case "enumerate":
            return { type, items: ["Item"] };
        case "spacer":
            return { type, size: 16 };
    }
}
