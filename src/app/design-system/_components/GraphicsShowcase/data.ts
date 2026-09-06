import palette from "@/app/components/DDS/Illustration/palette.json";
import { illustrationTokens } from "@/app/components/DDS/Illustration/primitives";
import { projectScenes } from "@/app/portfolio/_data/project-scenes";

export const graphicColors = [
    { name: "Primary shape", color: palette.ink },
    { name: "Active information", color: palette.accent },
    { name: "Supporting shape", color: palette.line },
    { name: "Background detail", color: palette.soft },
    { name: "Object surface", color: palette.paper },
];

export const graphicRules = [
    {
        title: "Shapes",
        description: "Simple filled forms, with lines for connections and scanning.",
    },
    {
        title: "Color",
        description: "Neutral objects, blue for active information.",
    },
    {
        title: "Motion",
        description: "Small movements, a brief pause, then repeat.",
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

const elementDefinitions = [
    { kind: "speech", name: "Hospital", layer: "Hospital", frame: [296, 97, 116, 160] },
    { kind: "speech", name: "Vehicle", layer: "Transportation", frame: [210, 154, 124, 89] },
    { kind: "speech", name: "Waveform", layer: "Voice", frame: [44, 108, 103, 92] },
    { kind: "vision", name: "Chair", layer: "Chair", frame: [116, 107, 122, 147] },
    { kind: "vision", name: "Plant", layer: "Plant", frame: [265, 88, 103, 166] },
    { kind: "graph", name: "Document", layer: "Text document", frame: [30, 56, 112, 144] },
] as const;

export const graphicElements = elementDefinitions.map(({ kind, name, layer, frame }) => ({
    name,
    frame,
    scene: {
        ...projectScenes[kind],
        layers: projectScenes[kind].layers
            .filter((item) => layer === "Voice" ? item.name.startsWith("Voice ") : item.name === layer)
            .map((item) => ({ ...item, motion: undefined })),
    },
}));
