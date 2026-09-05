import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export type MetricProps = ComponentProps<"div"> & {
    value: string;
    label: string;
    detail?: string;
    variant?: "inline" | "stacked";
};

export default function Metric({ value, label, detail, variant = "inline", className, ...props }: MetricProps) {
    return (
        <div className={cn("dds-metric", className)} data-variant={variant} {...props}>
            <p className="dds-metric-result font-body">
                <strong>{value}</strong>
                <span>{label}</span>
            </p>
            {detail && <p className="font-support text-muted">{detail}</p>}
        </div>
    );
}
