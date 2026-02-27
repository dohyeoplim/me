import { cn } from "@/app/lib/utils";
import { SectionLabelStyle } from "../types";

type Props = {
    label?: React.ReactNode;
    labelStyle?: SectionLabelStyle;
    className?: string;
    children: React.ReactNode;
    gapClassName?: string;
    labelClassName?: string;
};

export default function Section({
    label,
    labelStyle = "caption",
    className,
    children,
    gapClassName = "gap-4",
    labelClassName,
}: Props) {
    return (
        <div
            className={cn(
                "flex flex-col justify-start items-start",
                gapClassName,
                className,
            )}
        >
            {label ? (
                <div
                    className={cn(
                        labelStyle === "caption"
                            ? "font-caption01-light text-grey-500 select-none"
                            : "font-head01-medium text-grey-900",
                        labelClassName,
                    )}
                >
                    {label}
                </div>
            ) : null}
            {children}
        </div>
    );
}
