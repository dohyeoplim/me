"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LayoutGroup, useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { LayoutMotion } from "@/app/components/DDS/Motion/Provider";
import { getDdsMotionTransition } from "@/app/components/DDS/Motion";
import { sectionAtCenter, sectionScrollOffset } from "./position";
type Props = { sections: readonly { id: string; label: string }[]; label: string };

export default function SectionNavigation(props: Props) {
    return <LayoutMotion><SectionNavigationContent {...props} /></LayoutMotion>;
}

function SectionNavigationContent({ sections, label }: Props) {
    const layoutId = useId();
    const nav = useRef<HTMLElement>(null);
    const docked = useRef(false);
    const previousFocus = useRef<string | null>(null);
    const previousScroll = useRef(0);
    const [active, setActive] = useState<string>((sections[0]?.id ?? ""));
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
            const firstHeading = document.getElementById(sections[0]?.id ?? "")?.querySelector("h2");
            const top = firstHeading?.getBoundingClientRect().top ?? Infinity;
            const next = window.scrollY > 0 && top <= headerHeight + window.innerHeight * 0.25;
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
            const bounds = sections.flatMap(({ id }) => {
                const section = document.getElementById(id);
                if (!section) return [];
                const { top, bottom, height } = section.getBoundingClientRect();
                return height > 0 ? [{ id, top, bottom }] : [];
            });
            const atBottom = window.scrollY > 0 &&
                window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
            const viewport = {
                top: headerHeight,
                bottom: nav.current?.getBoundingClientRect().top ?? window.innerHeight,
            };
            setActive((previous) => sectionAtCenter(bounds, viewport, previous, atBottom) ?? previous);
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
    }, [sections]);

    const navigation = (
        <nav ref={nav} aria-label={label} className="dds-section-nav" data-floating={stuck}>
            <div className="dds-container">
                <LayoutGroup id={layoutId}>
                    <motion.ul layoutScroll>
                        {sections.map(({ id, label }) => (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    aria-current={active === id ? "location" : undefined}
                                    onClick={(event) => {
                                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                                        event.preventDefault();
                                        const section = document.getElementById(id);
                                        const heading = section?.querySelector("h2");
                                        const header = document.querySelector(".site-header-main");
                                        if (heading && section) window.scrollTo({
                                            top: window.scrollY + sectionScrollOffset(
                                                section.getBoundingClientRect(), heading.getBoundingClientRect().top,
                                                {
                                                    top: (header?.getBoundingClientRect().height ?? 0) + 24,
                                                    bottom: nav.current?.getBoundingClientRect().top ??
                                                        window.innerHeight,
                                                },
                                            ),
                                            behavior: reducedMotion ? "instant" : "smooth",
                                        });
                                        history.replaceState(null, "", `#${id}`);
                                    }}
                                >
                                    {active === id && (
                                        <motion.span
                                            layoutId="dds-section-indicator"
                                            className="dds-section-indicator"
                                            initial={false}
                                            transition={indicatorTransition}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="dds-section-label">{label}</span>
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
