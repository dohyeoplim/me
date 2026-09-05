"use client";

import { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { chapters } from "../../_data/navigation";

export default function ChapterNav() {
    const [active, setActive] = useState<string>(chapters[0].id);

    useEffect(() => {
        const sections = chapters.map(({ id }) => document.getElementById(id));
        let frame = 0;

        const update = () => {
            const current = sections.filter((section) => section && section.getBoundingClientRect().top <= 220);
            setActive(current.at(-1)?.id ?? chapters[0].id);
            frame = 0;
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <nav
            aria-label="Portfolio sections"
            className="sticky top-17 z-30 border-y border-grey-200 bg-grey-50/95 backdrop-blur-md md:top-25"
        >
            <ol className="flex gap-5 overflow-x-auto sm:gap-8">
                {chapters.map(({ id, label }, index) => (
                    <li key={id} className="shrink-0">
                        <a
                            href={`#${id}`}
                            aria-current={active === id ? "location" : undefined}
                            className={cn(
                                "flex min-h-14 items-center gap-2 border-b py-4 text-sm transition-colors",
                                active === id
                                    ? "border-grey-900 text-grey-900"
                                    : "border-transparent text-grey-500 hover:text-grey-900",
                            )}
                        >
                            <span className="hidden text-grey-400 sm:inline">0{index + 1}</span>
                            {label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
