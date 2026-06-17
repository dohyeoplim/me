import type { Block, BlockType, SectionNode } from "@/app/lib/content/schema";

export const BLOCK_LABELS: Record<BlockType, string> = {
    heading: "Heading",
    text: "Text",
    image: "Image",
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
    "image",
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
            return { id, type, text: "" };
        case "text":
            return { id, type, text: "" };
        case "image":
            return { id, type, url: "", alt: "" };
        case "divider":
            return { id, type };
        case "spacer":
            return { id, type, size: 16 };
        case "section":
            return { id, type, label: "", content: [] };
        case "item":
            return { id, type, title: "" };
        case "enumerate":
            return { id, type, items: [""] };
        case "project":
            return { id, type, name: "" };
    }
}

export type NodeType = SectionNode["type"];

export function createNode(type: NodeType): SectionNode {
    switch (type) {
        case "item":
            return { type, title: "" };
        case "enumerate":
            return { type, items: [""] };
        case "spacer":
            return { type, size: 16 };
    }
}
