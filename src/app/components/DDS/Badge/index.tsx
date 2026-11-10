import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export type BadgeProps = ComponentProps<"span"> & {
    tone?: "neutral" | "accent" | "success";
    variant?: "text" | "tag";
};

export default function Badge({ tone = "neutral", variant = "text", className, ...props }: BadgeProps) {
    return <span data-tone={tone} data-variant={variant} className={cn("ds-badge", className)} {...props} />;
}
