"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LayoutGroup, useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { LayoutMotion } from "@/app/components/DDS/Motion/Provider";
import { getDdsMotionTransition } from "@/app/components/DDS/Motion";
import { chapters } from "../../_data/navigation";

export default function ChapterNav() {
    return <LayoutMotion><ChapterNavContent /></LayoutMotion>;
}

function ChapterNavContent() {
    const nav = useRef<HTMLElement>(null);
    const docked = useRef(false);
    const previousFocus = useRef<string | null>(null);
    const previousScroll = useRef(0);
    const [active, setActive] = useState<string>(chapters[0].id);
    const [stuck, setStuck] = useState(false);
    const reducedMotion = useReducedMotion();
    const indicatorTransition = getDdsMotionTransition(reducedMotion);

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
        const list = nav.current?.querySelector("ul");
        const link = nav.current?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
        if (!list || !link) return;
        const listBounds = list.getBoundingClientRect();
        const linkBounds = link.getBoundingClientRect();
        const centered =
            list.scrollLeft + linkBounds.left - listBounds.left - (list.clientWidth - linkBounds.width) / 2;
        list.scrollTo({
            left: Math.max(0, centered),
            behavior: reducedMotion ? "auto" : "smooth",
        });
    }, [active, reducedMotion, stuck]);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            const header = document.querySelector(".site-header-main");
            const headerHeight = header?.getBoundingClientRect().height ?? 0;
            const top = document.querySelector("#research h2")?.getBoundingClientRect().top ?? Infinity;
            const next = top <= headerHeight + window.innerHeight * 0.25;
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
                return heading && heading.getBoundingClientRect().top <= headerHeight + 32;
            });
            const atBottom = window.scrollY > 0 &&
                window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
            setActive((atBottom ? chapters.at(-1)?.id : current.at(-1)?.id) ?? chapters[0].id);
            frame = 0;
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        const main = document.querySelector("main");
        const observer = new ResizeObserver(schedule);
        if (main) observer.observe(main);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, []);

    const navigation = (
        <nav ref={nav} aria-label="Portfolio sections" className="portfolio-section-nav" data-floating={stuck}>
            <div className="dds-container">
                <LayoutGroup id="portfolio-section-navigation">
                    <motion.ul layoutScroll>
                        {chapters.map(({ id, label }) => (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    aria-current={active === id ? "location" : undefined}
                                    onClick={(event) => {
                                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                                        event.preventDefault();
                                        document.getElementById(id)?.scrollIntoView({
                                            behavior: reducedMotion ? "instant" : "smooth",
                                            block: "start",
                                        });
                                        history.replaceState(null, "", `#${id}`);
                                    }}
                                >
                                    {active === id && (
                                        <motion.span
                                            layoutId="portfolio-section-indicator"
                                            className="portfolio-section-indicator"
                                            initial={false}
                                            transition={indicatorTransition}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="portfolio-section-label">{label}</span>
                                </a>
                            </li>
                        ))}
                    </motion.ul>
                </LayoutGroup>
            </div>
        </nav>
    );

    return stuck ? createPortal(navigation, document.body) : null;
}
