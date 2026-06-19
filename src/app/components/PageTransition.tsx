"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <ViewTransition
            key={pathname}
            enter={{
                "nav-forward": "slide-from-right",
                "nav-back": "slide-from-left",
                default: "none",
            }}
            exit={{
                "nav-forward": "slide-to-left",
                "nav-back": "slide-to-right",
                default: "none",
            }}
            default="none"
        >
            {children}
        </ViewTransition>
    );
}
