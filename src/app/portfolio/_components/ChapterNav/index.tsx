"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHeaderSecondaryNode } from "@/app/components/Header/HeaderSlot";
import { chapters } from "../../_data/navigation";

export default function ChapterNav() {
    const secondary = useHeaderSecondaryNode();
    const anchor = useRef<HTMLDivElement>(null);
    const nav = useRef<HTMLElement>(null);
    const docked = useRef(false);
    const previousFocus = useRef<string | null>(null);
    const previousScroll = useRef(0);
    const [active, setActive] = useState<string>(chapters[0].id);
    const [stuck, setStuck] = useState(false);
    const [height, setHeight] = useState(56);

    useLayoutEffect(() => {
        const list = nav.current?.querySelector("ul");
        if (list) list.scrollLeft = previousScroll.current;
        if (previousFocus.current) {
            const link = [...(nav.current?.querySelectorAll("a") ?? [])].find(
                (item) => item.getAttribute("href") === previousFocus.current,
            );
            link?.focus({ preventScroll: true });
            previousFocus.current = null;
        }
    }, [stuck]);

    useEffect(() => {
        const element = nav.current;
        if (!element) return;
        const measure = () => {
            const measured = element.getBoundingClientRect().height;
            setHeight(measured);
            document.documentElement.style.setProperty("--section-navigation-height", `${measured}px`);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        measure();
        return () => observer.disconnect();
    }, [stuck]);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            const header = document.querySelector(".site-header-main");
            const headerHeight = header?.getBoundingClientRect().height ?? 0;
            const navHeight = nav.current?.getBoundingClientRect().height ?? 0;
            const top = anchor.current?.getBoundingClientRect().top ?? Infinity;
            const next = Boolean(secondary) && top <= headerHeight;
            if (next !== docked.current) {
                const focused = document.activeElement;
                previousFocus.current =
                    focused instanceof HTMLAnchorElement && nav.current?.contains(focused)
                        ? focused.getAttribute("href")
                        : null;
                previousScroll.current = nav.current?.querySelector("ul")?.scrollLeft ?? 0;
                docked.current = next;
                setStuck(next);
            }
            const current = chapters.filter(({ id }) => {
                const section = document.getElementById(id);
                const heading = section?.querySelector("h2");
                return heading && heading.getBoundingClientRect().top <= headerHeight + navHeight + 32;
            });
            setActive(current.at(-1)?.id ?? chapters[0].id);
            frame = 0;
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [secondary]);

    const navigation = (
        <nav ref={nav} aria-label="Portfolio sections" className="portfolio-section-nav">
            <div className="dds-container">
                <ul>
                    {chapters.map(({ id, label }) => (
                        <li key={id}>
                            <a href={`#${id}`} aria-current={active === id ? "location" : undefined}>
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );

    return (
        <div ref={anchor} className="portfolio-nav-anchor" style={stuck ? { height } : undefined}>
            {stuck && secondary ? createPortal(navigation, secondary) : navigation}
        </div>
    );
}
