import { cn } from "@/app/lib/utils";
import type { BlockStyle } from "./schema";

export const SIZE_CLASS: Record<string, string> = {
    title1: "font-title01-light",
    title2: "font-title02-light",
    head: "font-head01-medium",
    body1: "font-body01-regular",
    body2: "font-body02-regular",
    body3: "font-body03-regular",
    caption: "font-caption01-light",
};

export const COLOR_CLASS: Record<string, string> = {
    default: "text-grey-900",
    muted: "text-grey-500",
    subtle: "text-grey-400",
    faint: "text-grey-300",
};

export const ALIGN_CLASS: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export const WEIGHT_CLASS: Record<string, string> = {
    light: "font-light",
    regular: "font-normal",
    medium: "font-medium",
};

export function resolveTypographyClass(
    style: BlockStyle,
    defaults: { size?: string; color?: string } = {},
) {
    const size = style?.size ?? defaults.size;
    const color = style?.color ?? defaults.color;
    return cn(
        size ? SIZE_CLASS[size] : undefined,
        color ? COLOR_CLASS[color] : undefined,
        style?.weight ? WEIGHT_CLASS[style.weight] : undefined,
        style?.align ? ALIGN_CLASS[style.align] : undefined,
    );
}

export function styleClasses(style?: BlockStyle) {
    if (!style) return undefined;
    return cn(
        style.size ? SIZE_CLASS[style.size] : undefined,
        style.color ? COLOR_CLASS[style.color] : undefined,
        style.align ? ALIGN_CLASS[style.align] : undefined,
        style.weight ? WEIGHT_CLASS[style.weight] : undefined,
    );
}
