"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Item from "./_components/Item";
import { useHeaderSlotRef } from "./HeaderSlot";

const blurLayers = [
    { blur: "10px", mask: "rgb(0 0 0) 0%, rgb(0 0 0) 15%, transparent 35%" },
    { blur: "5px", mask: "rgb(0 0 0) 0%, rgb(0 0 0) 30%, transparent 55%" },
    { blur: "2.5px", mask: "rgb(0 0 0) 0%, rgb(0 0 0) 50%, transparent 75%" },
    { blur: "1px", mask: "rgb(0 0 0) 0%, rgb(0 0 0) 70%, transparent 100%" },
];

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
            <div className="absolute inset-0">
                {blurLayers.map((layer, i) => (
                    <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                            backdropFilter: `blur(${layer.blur})`,
                            WebkitBackdropFilter: `blur(${layer.blur})`,
                            WebkitMaskImage: `linear-gradient(to bottom, ${layer.mask})`,
                            maskImage: `linear-gradient(to bottom, ${layer.mask})`,
                        }}
                    />
                ))}
                <div className="absolute inset-0 bg-linear-to-b from-grey-50/80 via-grey-50/45 to-transparent" />
            </div>
            <div className="relative max-w-4xl mx-auto px-6 pt-4 md:pt-16 pb-2 md:pb-4">
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
                        <div ref={setNode} className="flex items-center gap-3" />
                    </div>
                </nav>
            </div>
        </header>
    );
}
