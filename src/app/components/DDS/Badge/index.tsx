import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export type BadgeProps = ComponentProps<"span"> & {
    tone?: "neutral" | "accent" | "success";
};

export default function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
    return <span data-tone={tone} className={cn("ds-badge", className)} {...props} />;
}
