export { DDS as designSystem } from "@/app/components/DDS/config";

export const navigation = [
    { id: "foundations", label: "Foundations" },
    { id: "buttons", label: "Buttons" },
    { id: "components", label: "Components" },
    { id: "graphics", label: "Graphics" },
    { id: "loading", label: "Loading" },
];

export const colors = [
    { name: "Background", token: "--surface-page", hex: "#FAFAFC" },
    { name: "Surface", token: "--surface-panel", hex: "#FFFFFF" },
    { name: "Subtle fill", token: "--surface-muted", hex: "#F3F3F6" },
    { name: "Divider", token: "--border-subtle", hex: "#DCDCE3" },
    { name: "Text", token: "--text-primary", hex: "#0F0F10" },
    { name: "Diagram", token: "--diagram-accent", hex: "#547A9F" },
    { name: "Illustration background", token: "--surface-illustration", hex: "#F3F6F8" },
];

export const typography = [
    {
        name: "Page title", className: "font-page-title", sample: "Portfolio",
        size: "36 to 44px", weight: "Medium 500", tracking: "-0.025em", leading: "115%",
    },
    {
        name: "Section title", className: "font-section-title", sample: "Research",
        size: "24 to 28px", weight: "Medium 500", tracking: "-0.025em", leading: "125%",
    },
    {
        name: "Project title", className: "font-work-title", sample: "Industrial OCR",
        size: "20 to 22px", weight: "Medium 500", tracking: "-0.025em", leading: "135%",
    },
    {
        name: "Body",
        className: "font-body",
        sample: "I study document understanding and structured identifier recognition.",
        size: "16 to 17px", weight: "Regular 400", tracking: "0em", leading: "165%",
    },
    {
        name: "Supporting text", className: "font-support", sample: "First author, under review",
        size: "15px", weight: "Regular 400", tracking: "0em", leading: "150%",
    },
];

export const spacing = [
    { name: "Within a control", token: "xs", value: 8 },
    { name: "Related content", token: "md", value: 16 },
    { name: "Page padding", token: "lg", value: 24 },
    { name: "Content groups", token: "xl", value: 32 },
    { name: "Between columns", token: "2xl", value: 48 },
];

export const corners = [
    { name: "Control", value: "control", radius: "8px" },
    { name: "Surface", value: "surface", radius: "12px" },
    { name: "Pill", value: "pill", radius: "999px" },
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
