"use client";

import Link from "next/link";
import { usePreviousPath } from "./PreviousPath";

export default function GoBack({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    const prev = usePreviousPath();
    return (
        <Link
            href={prev ?? "/blog"}
            transitionTypes={["nav-back"]}
            className={className}
        >
            {children}
        </Link>
    );
}
