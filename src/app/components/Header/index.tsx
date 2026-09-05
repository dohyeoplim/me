"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Item from "./_components/Item";
import { useHeaderSecondaryRef, useHeaderSlotRef } from "./HeaderSlot";

export default function Header() {
    const pathname = usePathname();
    const main = useRef<HTMLElement>(null);
    const setNode = useHeaderSlotRef();
    const setSecondaryNode = useHeaderSecondaryRef();
    const isAdmin = pathname.startsWith("/admin");

    useEffect(() => {
        const element = main.current;
        if (!element) return;
        const measure = () => {
            document.documentElement.style.setProperty(
                "--site-header-row-height",
                `${element.getBoundingClientRect().height}px`,
            );
        };
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        measure();
        return () => observer.disconnect();
    }, []);

    return (
        <header style={{ viewTransitionName: "site-header" }} className="site-header">
            <nav ref={main} className="dds-container site-header-main" aria-label="Main navigation">
                <Link href={isAdmin ? "/admin" : "/"} transitionTypes={["nav-back"]}>
                    <Item label={isAdmin ? "CMS" : "Dohyeop Lim"} className="select-none" />
                </Link>
                <div className="flex items-center gap-dds-lg">
                    {!isAdmin &&
                        [
                            { href: "/portfolio", label: "Portfolio" },
                            { href: "/blog", label: "Writing" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                aria-current={pathname.startsWith(href) ? "page" : undefined}
                                transitionTypes={["nav-forward"]}
                                className="font-support text-muted transition-colors hover:text-ink"
                            >
                                {label}
                            </Link>
                        ))}
                    <div ref={setNode} className="site-header-actions flex items-center gap-dds-sm" />
                </div>
            </nav>
            <div ref={setSecondaryNode} className="site-header-secondary" />
        </header>
    );
}
