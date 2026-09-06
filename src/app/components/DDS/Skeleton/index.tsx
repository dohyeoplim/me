import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

type SkeletonWidth = "full" | "long" | "medium" | "short";

export type SkeletonProps = ComponentProps<"span"> & {
    variant?: "text" | "title" | "section" | "heading" | "control" | "avatar" | "media";
    width?: SkeletonWidth;
};

export default function Skeleton({ variant = "text", width = "full", className, ...props }: SkeletonProps) {
    return (
        <span
            {...props}
            aria-hidden="true"
            className={cn("dds-skeleton", className)}
            data-variant={variant}
            data-width={width}
        />
    );
}

export function SkeletonText({ lines = 3, lastLine = "medium" }: { lines?: number; lastLine?: SkeletonWidth }) {
    return (
        <div className="dds-skeleton-text" aria-hidden="true">
            {Array.from({ length: lines }, (_, index) => (
                <Skeleton key={index} width={index === lines - 1 ? lastLine : "full"} />
            ))}
        </div>
    );
}

export function SkeletonGroup({ label, className, children, ...props }: ComponentProps<"div"> & { label: string }) {
    return (
        <div {...props} className={cn("dds-skeleton-group", className)} role="status">
            <span className="sr-only">{label}</span>
            <div className="dds-skeleton-content" aria-hidden="true">{children}</div>
        </div>
    );
}
