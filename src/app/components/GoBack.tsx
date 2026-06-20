"use client";

import Link from "next/link";
import { useBackNav } from "./PreviousPath";

export default function GoBack({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    const { previous, markBack } = useBackNav();
    return (
        <Link
            href={previous ?? "/blog"}
            onClick={markBack}
            transitionTypes={["nav-back"]}
            className={className}
        >
            {children}
        </Link>
    );
}
