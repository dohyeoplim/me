import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

type ButtonAppearance = {
    variant?: "solid" | "outline" | "text";
    size?: "small" | "medium" | "large";
};

export type ButtonProps = ComponentProps<"button"> & ButtonAppearance;
export type ButtonLinkProps = ComponentProps<"a"> & ButtonAppearance & { href: string };

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

export function ButtonLink({ variant = "solid", size = "medium", className, ...props }: ButtonLinkProps) {
    return <a data-variant={variant} data-size={size} className={cn("ds-button", className)} {...props} />;
}
