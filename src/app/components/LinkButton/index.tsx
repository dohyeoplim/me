import { ArrowRight, ExternalLink } from "lucide-react";
import { LinkButtonProps } from "./types";
import { cn } from "@/app/lib/utils";

export default function LinkButton({ href, label, icon = "arrow", className, ...props }: LinkButtonProps) {
    return (
        <a
            href={href}
            className={cn("dds-link", className)}
            data-icon={icon}
            target={href && href.startsWith("http") ? "_blank" : undefined}
            rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
            {...props}
        >
            <span className="dds-link-label">{label}</span>
            {icon === "arrow" && <ArrowRight size={14} className="dds-link-icon" aria-hidden="true" />}
            {icon === "external" && <ExternalLink size={14} className="dds-link-icon" aria-hidden="true" />}
        </a>
    );
}
