import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

type Props = ComponentProps<"details"> & {
    label: string;
    variant?: "plain" | "outlined";
};

export default function Disclosure({ label, variant = "outlined", className, children, ...props }: Props) {
    return (
        <details className={cn("dds-disclosure", className)} data-variant={variant} {...props}>
            <summary className="font-support">{label}</summary>
            <div className="dds-disclosure-content font-body">{children}</div>
        </details>
    );
}
