import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export type ButtonProps = ComponentProps<"button"> & {
    variant?: "solid" | "outline" | "text";
    size?: "small" | "medium" | "large";
};

export default function Button({
    variant = "solid",
    size = "medium",
    type = "button",
    className,
    ...props
}: ButtonProps) {
    return (
        <button type={type} data-variant={variant} data-size={size} className={cn("ds-button", className)} {...props} />
    );
}
