import { cn } from "@/app/lib/utils";
import { resolveTypographyClass } from "@/app/lib/content/style";
import type { BlockStyle } from "../types";

type Props = {
    children: React.ReactNode;
    className?: string;
    style?: BlockStyle;
};

export default function Heading({ children, className, style }: Props) {
    return (
        <div
            className={cn(
                resolveTypographyClass(style, {
                    size: "head",
                    color: "default",
                }),
                className,
            )}
        >
            {children}
        </div>
    );
}
