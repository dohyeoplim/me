"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Item from "./_components/Item";
import { useHeaderSlotRef } from "./HeaderSlot";

export default function Header() {
    const pathname = usePathname();
    const setNode = useHeaderSlotRef();
    const isAdmin = pathname.startsWith("/admin");
    const label = isAdmin ? "CMS" : "Dohyeop Lim";
    const href = isAdmin ? "/admin" : "/";

    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-6 pt-4 md:pt-16 pb-2 md:pb-4">
                <nav className="w-full flex items-center justify-between">
                    <Link href={href}>
                        <Item label={label} className="select-none" />
                    </Link>
                    <div ref={setNode} className="flex items-center gap-3" />
                </nav>
            </div>
        </header>
    );
}
