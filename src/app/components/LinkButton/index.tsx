import { ArrowRight, ExternalLink } from "lucide-react";
import { LinkButtonProps } from "./types";
import { cn } from "@/app/lib/utils";

export default function LinkButton({ href, label, icon = "arrow", className, ...props }: LinkButtonProps) {
    return (
        <a
            href={href}
            className={cn(
                "inline-flex items-center gap-dds-2xs font-body03-regular text-muted",
                "transition-colors hover:text-ink",
                className,
            )}
            target={href && href.startsWith("http") ? "_blank" : undefined}
            rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
            {...props}
        >
            {label}
            {icon === "arrow" && <ArrowRight size={14} className="text-muted" />}
            {icon === "external" && <ExternalLink size={14} className="text-muted" />}
        </a>
    );
}
