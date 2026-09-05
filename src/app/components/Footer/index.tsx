"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const home = pathname === "/";

    return (
        <footer
            className={`dds-container site-footer ${home ? "pb-dds-xl" : "pb-dds-3xl"}`}
            data-home={home || undefined}
        >
            <hr className="h-px text-line mb-dds-lg" />
            <div className="flex items-center justify-between gap-dds-md">
                <small className="font-body04-light text-muted">&copy; 2026 Dohyeop Lim</small>
                <Link
                    href="/design-system"
                    className="font-body03-regular text-muted hover:text-ink"
                    aria-label="DDS, DohyeopLim Design System"
                >
                    DDS
                </Link>
            </div>
        </footer>
    );
}
