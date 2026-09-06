export { DDS as designSystem } from "@/app/components/DDS/config";

export const navigation = [
    { id: "foundations", label: "Foundations" },
    { id: "buttons", label: "Buttons" },
    { id: "components", label: "Components" },
    { id: "graphics", label: "Graphics" },
    { id: "motion", label: "Motion" },
    { id: "loading", label: "Loading" },
];

export const colors = [
    { name: "Background", token: "--surface-page" },
    { name: "Surface", token: "--surface-panel" },
    { name: "Subtle fill", token: "--surface-muted" },
    { name: "Divider", token: "--border-subtle" },
    { name: "Text", token: "--text-primary" },
    { name: "Diagram", token: "--diagram-accent" },
    { name: "Illustration background", token: "--surface-illustration" },
];

export const typography = [
    { name: "Page title", className: "font-page-title", sample: "Portfolio" },
    { name: "Section title", className: "font-section-title", sample: "Research" },
    { name: "Project title", className: "font-work-title", sample: "Industrial OCR" },
    {
        name: "Body",
        className: "font-body",
        sample: "I study document understanding and structured identifier recognition.",
    },
    { name: "Supporting text", className: "font-support", sample: "First author, under review" },
];

export const spacing = [
    { name: "Within a control", token: "xs", value: 8 },
    { name: "Related content", token: "md", value: 16 },
    { name: "Page padding", token: "lg", value: 24 },
    { name: "Content groups", token: "xl", value: 32 },
    { name: "Between columns", token: "2xl", value: 48 },
];

export const corners = [
    { name: "Control", value: "control" },
    { name: "Surface", value: "surface" },
    { name: "Pill", value: "pill" },
] as const;

export const buttonSizes = [
    { size: "small", label: "Small", height: 28 },
    { size: "medium", label: "Medium", height: 36 },
    { size: "large", label: "Large", height: 44 },
] as const;

export const buttonStates = [
    { id: "default", label: "Default" },
    { id: "hover", label: "Hover" },
    { id: "pressed", label: "Pressed" },
    { id: "focus", label: "Focus" },
    { id: "selected", label: "Selected" },
    { id: "disabled", label: "Disabled" },
] as const;

export const buttonVariants = [
    { value: "solid", label: "Solid" },
    { value: "soft", label: "Soft" },
    { value: "outline", label: "Outline" },
    { value: "text", label: "Text" },
] as const;

export const surfaceVariants = [
    { value: "plain", label: "Plain", detail: "Content on the page background." },
    { value: "subtle", label: "Subtle", detail: "A quiet background for an example." },
    { value: "outlined", label: "Outlined", detail: "A visible boundary around related content." },
] as const;
