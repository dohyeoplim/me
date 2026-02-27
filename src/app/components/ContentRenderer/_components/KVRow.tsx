import { cn } from "@/app/lib/utils";

type Props = {
    left: React.ReactNode;
    right: React.ReactNode;
    className?: string;
    leftClassName?: string;
    rightClassName?: string;
};

export default function KVRow({
    left,
    right,
    className,
    leftClassName,
    rightClassName,
}: Props) {
    return (
        <div
            className={cn(
                "flex justify-between items-start w-full gap-4",
                className,
            )}
        >
            <div
                className={cn(
                    "font-head01-medium text-grey-900",
                    leftClassName,
                )}
            >
                {left}
            </div>
            <div
                className={cn(
                    "flex justify-end items-start gap-1.5 shrink-0",
                    rightClassName,
                )}
            >
                {right}
            </div>
        </div>
    );
}
