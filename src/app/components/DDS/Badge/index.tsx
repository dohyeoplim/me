import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

type Props = ComponentProps<"span"> & {
    tone?: "neutral" | "accent" | "success";
};

export default function Badge({ tone = "neutral", className, ...props }: Props) {
    return <span data-tone={tone} className={cn("ds-badge", className)} {...props} />;
}
