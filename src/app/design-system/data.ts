export { DDS as designSystem } from "@/app/components/DDS/config";

export const colors = [
    { name: "Page", token: "--surface-page", value: "#FAFAFC" },
    { name: "Panel", token: "--surface-panel", value: "#FFFFFF" },
    { name: "Muted", token: "--surface-muted", value: "#F3F3F6" },
    { name: "Border", token: "--border-subtle", value: "#DCDCE3" },
    { name: "Secondary", token: "--text-secondary", value: "#5A5A60" },
    { name: "Primary", token: "--text-primary", value: "#0F0F10" },
    { name: "Action", token: "--accent", value: "#1C1C1E" },
    { name: "Diagram", token: "--diagram-accent", value: "#547A9F" },
];

export const typography = [
    { name: "Display", className: "font-display-light", sample: "Dohyeop Lim", detail: "44 to 72px, Light" },
    { name: "Title", className: "font-title02-light", sample: "Selected research", detail: "32 to 40px, Light" },
    {
        name: "Feature",
        className: "font-feature-light",
        sample: "Document understanding",
        detail: "28 to 36px, Light",
    },
    {
        name: "Heading",
        className: "font-head01-medium",
        sample: "Research experience",
        detail: "20 to 22px, Medium",
    },
    {
        name: "Body",
        className: "font-body02-light",
        sample: "I work on document understanding and applied AI.",
        detail: "16 to 17px, Light",
    },
    {
        name: "Supporting",
        className: "font-body03-regular",
        sample: "First author, under review",
        detail: "15px, Regular",
    },
];

export const buttonSizes = [
    { size: "small", label: "Small", height: 32 },
    { size: "medium", label: "Medium", height: 44 },
    { size: "large", label: "Large", height: 52 },
] as const;

export const buttonStates = [
    { id: "default", label: "Default" },
    { id: "hover", label: "Hover" },
    { id: "pressed", label: "Pressed" },
    { id: "focus", label: "Focus" },
    { id: "disabled", label: "Disabled" },
] as const;

export const buttonVariants = ["solid", "outline", "text"] as const;
export const spacing = [
    { name: "2xs", value: 4, usage: "Close alignment" },
    { name: "xs", value: 8, usage: "Icon and text" },
    { name: "sm", value: 12, usage: "Related controls" },
    { name: "md", value: 16, usage: "Paragraphs" },
    { name: "lg", value: 24, usage: "Page gutters" },
    { name: "xl", value: 32, usage: "Content groups" },
    { name: "2xl", value: 48, usage: "Columns" },
    { name: "3xl", value: 64, usage: "Subsections" },
    { name: "4xl", value: 96, usage: "Separate works" },
    { name: "5xl", value: 128, usage: "Large sections" },
];
