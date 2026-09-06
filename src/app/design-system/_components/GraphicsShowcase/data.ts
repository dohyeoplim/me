import palette from "@/app/components/DDS/Illustration/palette.json";
import { illustrationTokens } from "@/app/components/DDS/Illustration/primitives";

export const graphicColors = [
    { name: "Primary shape", color: palette.ink },
    { name: "Active information", color: palette.accent },
    { name: "Supporting shape", color: palette.line },
    { name: "Background detail", color: palette.soft },
    { name: "Object surface", color: palette.paper },
];

export const graphicRules = [
    {
        title: "One idea per scene",
        description: "Show the task or method. Keep detailed architecture and results in the accompanying text.",
    },
    {
        title: "Filled shapes first",
        description: "Use a few recognizable silhouettes. Reserve outlines for connections, detection, and boundaries.",
    },
    {
        title: "Color carries meaning",
        description:
            "Use blue for active fields and verification. Use neutral tones for objects and supporting details.",
    },
    {
        title: "Direct connections",
        description:
            "Connect related objects with straight lines. Add bends only to explain a route or avoid overlap.",
    },
    {
        title: "Fit the visible frame",
        description: "Balance left and right margins across the whole animation. Keep moving objects inside the frame.",
    },
    {
        title: "Quiet repetition",
        description: "Use a short action, a pause, and a return. Hide position resets with a fade when needed.",
    },
];

export const graphicSpecs = [
    { name: "Drawing canvas", value: `${illustrationTokens.canvas.width} × ${illustrationTokens.canvas.height}` },
    { name: "Detail / connection / emphasis", value: Object.values(illustrationTokens.stroke).join(" / ") },
    { name: "Small shape / object / panel corners", value: Object.values(illustrationTokens.radius).join(" / ") },
    {
        name: "Loop duration",
        value: `${illustrationTokens.motion.frames / illustrationTokens.motion.frameRate} seconds`,
    },
];

export const graphicExamples = [
    { kind: "speech", name: "Transportation", detail: "Appear, travel to the destination, then fade out." },
    { kind: "calls", name: "Conversation", detail: "Connect speech with a health record." },
    { kind: "vision", name: "Verification", detail: "Scan each object in sequence." },
    { kind: "graph", name: "Retrieval", detail: "Select fields, connect documents, and assemble a response." },
    { kind: "driving", name: "Depth grouping", detail: "Separate depth groups and pool their features independently." },
] as const;
