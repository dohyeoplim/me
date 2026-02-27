import { cn } from "@/app/lib/utils";
import { textWithBreaks } from "../utils";

type Props = {
    title?: string;
    subtitle?: string;
    meta?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    metaClassName?: string;
};

export default function Item({
    title,
    subtitle,
    meta,
    className,
    titleClassName,
    subtitleClassName,
    metaClassName,
}: Props) {
    return (
        <div
            className={cn(
                "flex flex-col justify-start items-start gap-1",
                className,
            )}
        >
            {title ? (
                <div
                    className={cn(
                        "font-head01-medium text-grey-900",
                        titleClassName,
                    )}
                >
                    {textWithBreaks(title)}
                </div>
            ) : null}

            {subtitle ? (
                <div
                    className={cn(
                        "font-body02-regular text-grey-900",
                        subtitleClassName,
                    )}
                >
                    {textWithBreaks(subtitle)}
                </div>
            ) : null}

            {meta ? (
                <div
                    className={cn(
                        "font-body04-light text-grey-500",
                        metaClassName,
                    )}
                >
                    {textWithBreaks(meta)}
                </div>
            ) : null}
        </div>
    );
}
