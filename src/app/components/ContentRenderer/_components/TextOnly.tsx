import { cn } from "@/app/lib/utils";
import { resolveTypographyClass } from "@/app/lib/content/style";
import type { BlockStyle } from "../types";

type Props = {
    children: React.ReactNode;
    className?: string;
    style?: BlockStyle;
};

export default function TextOnly({ children, className, style }: Props) {
    return (
        <div
            className={cn(
                resolveTypographyClass(style, {
                    size: "body2",
                    color: "default",
                }),
                className,
            )}
        >
            {children}
        </div>
    );
}
