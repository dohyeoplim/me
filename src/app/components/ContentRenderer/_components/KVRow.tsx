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
            className={cn("inline-flex justify-between items-start", className)}
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
                    "flex justify-start items-start gap-1.5",
                    rightClassName,
                )}
            >
                {right}
            </div>
        </div>
    );
}
