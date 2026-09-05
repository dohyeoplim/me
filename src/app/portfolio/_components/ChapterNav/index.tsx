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
        <nav aria-label="Portfolio sections" className="portfolio-nav">
            <ol className="flex gap-dds-lg overflow-x-auto sm:gap-dds-xl">
                {chapters.map(({ id, label }) => (
                    <li key={id} className="shrink-0">
                        <a
                            href={`#${id}`}
                            aria-current={active === id ? "location" : undefined}
                            className={cn(
                                "flex min-h-14 items-center gap-dds-xs border-b py-dds-md",
                                "font-body03-regular transition-colors",
                                active === id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
                            )}
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
