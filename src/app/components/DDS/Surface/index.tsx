import type { ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export default function Surface({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("ds-panel", className)} {...props} />;
}
