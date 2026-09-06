import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import "./select.css";

export default function Select({ children, ...props }: ComponentProps<"select">) {
    return <span className="dds-select" data-multiple={props.multiple || undefined}>
        <select {...props}>{children}</select>
        {!props.multiple && <ChevronDown size={16} aria-hidden="true" />}
    </span>;
}
