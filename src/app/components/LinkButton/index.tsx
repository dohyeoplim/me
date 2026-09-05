import { ArrowRight, ExternalLink } from "lucide-react";
import { LinkButtonProps } from "./types";
import { cn } from "@/app/lib/utils";

export default function LinkButton({ href, label, icon = "arrow", className, ...props }: LinkButtonProps) {
    return (
        <a
            href={href}
            className={cn(
                "inline-flex items-center gap-1 font-body03-regular text-grey-600",
                "transition-colors hover:text-grey-900",
                className,
            )}
            target={href && href.startsWith("http") ? "_blank" : undefined}
            rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
            {...props}
        >
            {label}
            {icon === "arrow" && <ArrowRight size={14} className="text-grey-600" />}
            {icon === "external" && <ExternalLink size={14} className="text-grey-600" />}
        </a>
    );
}
