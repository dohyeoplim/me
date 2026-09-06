"use client";

import { useId, useRef, useState, useEffect, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import IconButton from "../IconButton";

type Props = { label: string; children: ReactNode };

export default function Carousel({ label, children }: Props) {
    const track = useRef<HTMLDivElement>(null);
    const id = useId();
    const reducedMotion = useReducedMotion();
    const [edges, setEdges] = useState({ start: true, end: false });

    useEffect(() => {
        const element = track.current;
        if (!element) return;
        const update = () => setEdges({
            start: element.scrollLeft <= 2,
            end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
        });
        const observer = new ResizeObserver(update);
        observer.observe(element);
        element.addEventListener("scroll", update, { passive: true });
        update();
        return () => {
            observer.disconnect();
            element.removeEventListener("scroll", update);
        };
    }, []);

    const move = (direction: number) => {
        const element = track.current;
        if (!element) return;
        const step = element.children[1] instanceof HTMLElement && element.children[0] instanceof HTMLElement
            ? element.children[1].offsetLeft - element.children[0].offsetLeft
            : element.clientWidth;
        element.scrollBy({ left: direction * step, behavior: reducedMotion ? "instant" : "smooth" });
    };

    return (
        <div className="dds-carousel" role="region" aria-label={label} aria-roledescription="carousel">
            <div ref={track} id={id} className="dds-carousel-track" tabIndex={0} aria-label={label}>
                {children}
            </div>
            <div className="dds-carousel-controls">
                <IconButton variant="outline" aria-label="Previous item" aria-controls={id}
                    disabled={edges.start} onClick={() => move(-1)}><ArrowLeft size={18} /></IconButton>
                <IconButton variant="outline" aria-label="Next item" aria-controls={id}
                    disabled={edges.end} onClick={() => move(1)}><ArrowRight size={18} /></IconButton>
            </div>
        </div>
    );
}
