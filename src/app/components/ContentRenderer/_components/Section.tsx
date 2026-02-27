import { cn } from "@/app/lib/utils";

type Props = {
    label?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
    gapClassName?: string;
    labelClassName?: string;
};

export default function Section({
    label,
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
                        "font-caption01-light text-grey-500",
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
