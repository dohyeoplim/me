import * as React from "react";
import { textWithBreaks } from "../utils";

function cn(...classes: Array<string | undefined | false | null>) {
    return classes.filter(Boolean).join(" ");
}

type ContentBlockProps = {
    className?: string;
    widthClassName?: string;
    gapClassName?: string;
    children: React.ReactNode;
};

export function ContentBlock({
    className,
    widthClassName = "w-full max-w-[512px]",
    gapClassName = "gap-8",
    children,
}: ContentBlockProps) {
    return (
        <div
            className={cn(
                widthClassName,
                "inline-flex flex-col justify-start items-start",
                gapClassName,
                className,
            )}
        >
            {children}
        </div>
    );
}

ContentBlock.TextOnly = function TextOnly({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("font-body02-regular text-grey-900", className)}>
            {children}
        </div>
    );
};

ContentBlock.Divider = function Divider({ className }: { className?: string }) {
    return (
        <hr
            className={cn(
                "w-full border-none h-[0.5px] bg-grey-200",
                className,
            )}
        />
    );
};

ContentBlock.Section = function Section({
    label,
    className,
    children,
    gapClassName = "gap-4",
    labelClassName,
}: {
    label?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
    gapClassName?: string;
    labelClassName?: string;
}) {
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
};

ContentBlock.Item = function Item({
    title,
    subtitle,
    meta,
    className,
    titleClassName,
    subtitleClassName,
    metaClassName,
}: {
    title?: string;
    subtitle?: string;
    meta?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    metaClassName?: string;
}) {
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
};

ContentBlock.KVRow = function KVRow({
    left,
    right,
    className,
    leftClassName,
    rightClassName,
}: {
    left: React.ReactNode;
    right: React.ReactNode;
    className?: string;
    leftClassName?: string;
    rightClassName?: string;
}) {
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
};
