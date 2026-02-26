import { ArrowRight, ExternalLink } from "lucide-react";
import { LinkButtonProps } from "./types";

export default function LinkButton({
    href,
    label,
    icon = "arrow",
    className,
    ...props
}: LinkButtonProps) {
    return (
        <a
            href={href}
            className={`flex items-center gap-1 font-body03-regular text-grey-600 hover:text-grey-900 transition-colors cursor-pointer ${className || ""}`}
            target={href && href.startsWith("http") ? "_blank" : undefined}
            {...props}
        >
            {label}
            {icon === "arrow" && (
                <ArrowRight size={14} className="text-grey-600" />
            )}
            {icon === "external" && (
                <ExternalLink size={14} className="text-grey-600" />
            )}
        </a>
    );
}
