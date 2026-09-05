import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

type Props = ComponentProps<"details"> & {
    label: string;
    variant?: "plain" | "outlined";
    contentTone?: "default" | "subtle";
};

export default function Disclosure({
    label,
    variant = "outlined",
    contentTone = "default",
    className,
    children,
    ...props
}: Props) {
    return (
        <details
            className={cn("dds-disclosure", className)}
            data-variant={variant}
            data-content-tone={contentTone}
            {...props}
        >
            <summary className="font-support">{label}</summary>
            <div className="dds-disclosure-content font-body">{children}</div>
        </details>
    );
}
