import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export type SectionHeadingProps = ComponentProps<"header"> & {
    title: string;
    description?: string;
    variant?: "section" | "subsection";
    as?: "h2" | "h3" | "h4";
};

export default function SectionHeading({
    title,
    description,
    variant = "section",
    as,
    className,
    ...props
}: SectionHeadingProps) {
    const Heading = as ?? (variant === "section" ? "h2" : "h3");

    return (
        <header className={cn("dds-section-heading", className)} data-variant={variant} {...props}>
            <Heading className={variant === "section" ? "font-section-title" : "font-work-title"}>
                {title}
            </Heading>
            {description && <p className="font-body text-muted">{description}</p>}
        </header>
    );
}
