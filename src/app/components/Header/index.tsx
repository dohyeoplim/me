"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Item from "./_components/Item";
import { useHeaderSlotRef } from "./HeaderSlot";

const tint =
    "linear-gradient(to bottom, rgb(250 250 252 / 1) 0%, rgb(250 250 252 / 0.85) 45%, rgb(250 250 252 / 0) 100%)";

export default function Header() {
    const pathname = usePathname();
    const setNode = useHeaderSlotRef();

    const isAdmin = pathname.startsWith("/admin");
    const label = isAdmin ? "CMS" : "Dohyeop Lim";
    const href = isAdmin ? "/admin" : "/";

    return (
        <header
            style={{ viewTransitionName: "site-header" }}
            className="fixed top-0 left-0 w-full z-50 pointer-events-none"
        >
            <div className="absolute inset-0" style={{ background: tint }} />
            <div className="relative max-w-4xl mx-auto px-6 pt-4 md:pt-10 pb-3 md:pb-7">
                <nav className="pointer-events-auto w-full flex items-center justify-between">
                    <Link href={href} transitionTypes={["nav-back"]}>
                        <Item label={label} className="select-none" />
                    </Link>
                    <div className="flex items-center gap-4">
                        {!isAdmin && (
                            <Link
                                href="/blog"
                                transitionTypes={["nav-forward"]}
                                className="font-body04-light text-grey-500 transition-colors hover:text-grey-900"
                            >
                                Writing
                            </Link>
                        )}
                        <div
                            ref={setNode}
                            className="flex items-center gap-3"
                        />
                    </div>
                </nav>
            </div>
        </header>
    );
}
