import { cn } from "@/app/lib/utils";

type Props = {
    size?: number | string;
    className?: string;
};

export default function Spacer({ size = 16, className }: Props) {
    const value = typeof size === "number" ? `${size}px` : size;

    return (
        <div
            className={cn("w-full shrink-0", className)}
            style={{ height: value }}
        />
    );
}
