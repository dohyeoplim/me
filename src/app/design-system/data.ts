export { DDS as designSystem } from "@/app/components/DDS/config";

export const colors = [
    { name: "Page", token: "--surface-page", value: "#FAFAFC" },
    { name: "Panel", token: "--surface-panel", value: "#FFFFFF" },
    { name: "Muted", token: "--surface-muted", value: "#F3F3F6" },
    { name: "Border", token: "--border-subtle", value: "#DCDCE3" },
    { name: "Secondary", token: "--text-secondary", value: "#5A5A60" },
    { name: "Primary", token: "--text-primary", value: "#0F0F10" },
    { name: "Accent", token: "--accent", value: "#355BD6" },
    { name: "Success", token: "--success", value: "#32694C" },
];

export const typography = [
    { name: "Display", className: "font-display-light", sample: "Quietly clear.", detail: "44 to 76px · Light" },
    { name: "Title", className: "font-title02-light", sample: "Space to understand.", detail: "32 to 40px · Light" },
    {
        name: "Heading",
        className: "font-head01-medium",
        sample: "A little more clarity.",
        detail: "20 to 22px · Medium",
    },
    {
        name: "Body",
        className: "font-body02-light",
        sample: "Made for reading, at your own pace.",
        detail: "16 to 17px · Light",
    },
    { name: "Label", className: "ds-label", sample: "Small details, naturally written.", detail: "14px · Regular" },
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
export const spacing = [4, 8, 12, 16, 24, 32, 48, 64];
