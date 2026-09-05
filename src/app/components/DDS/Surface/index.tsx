import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export type SurfaceProps = ComponentProps<"div"> & {
    variant?: "plain" | "subtle" | "outlined";
    padding?: "none" | "compact" | "comfortable";
};

export default function Surface({
    variant = "outlined",
    padding = "none",
    className,
    ...props
}: SurfaceProps) {
    return (
        <div
            className={cn("dds-surface", className)}
            data-variant={variant}
            data-padding={padding}
            {...props}
        />
    );
}
