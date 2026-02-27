import { cn } from "@/app/lib/utils";

type ContentBlockProps = {
    className?: string;
    widthClassName?: string;
    gapClassName?: string;
    children: React.ReactNode;
};

export default function ContentBlock({
    className,
    widthClassName = "w-full md:max-w-[512px]",
    gapClassName = "gap-8",
    children,
}: ContentBlockProps) {
    return (
        <div
            className={cn(
                "w-full inline-flex flex-col justify-start items-start",
                widthClassName,
                gapClassName,
                className,
            )}
        >
            {children}
        </div>
    );
}
