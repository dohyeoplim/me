"use client";

import { useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import Button from "../Button";
import IconButton from "../IconButton";
import { useAnimate, useReducedMotion } from "motion/react";
import { getDdsMotionTransition } from "../Motion";

type Props = { title: string; label: string; children: ReactNode; expandFromCard?: boolean };

export default function DetailDialog({ title, label, children, expandFromCard = false }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [, animate] = useAnimate();
    const targetBounds = useRef<DOMRect | null>(null);
    const playback = useRef<{ stop: () => void } | null>(null);
    const origin = useRef<HTMLElement | null>(null);
    const trigger = useRef<HTMLButtonElement | null>(null);
    const closing = useRef(false);
    const reducedMotion = useReducedMotion();
    const titleId = useId();

    const displacement = () => {
        const source = origin.current?.getBoundingClientRect();
        const target = targetBounds.current;
        if (!source || !target) return { x: 0, y: 0, scaleX: 1, scaleY: 1 };
        return {
            x: source.left + source.width / 2 - target.left - target.width / 2,
            y: source.top + source.height / 2 - target.top - target.height / 2,
            scaleX: source.width / target.width,
            scaleY: source.height / target.height,
        };
    };

    const close = async () => {
        if (closing.current || !dialog.current) return;
        closing.current = true;
        playback.current?.stop();
        if (expandFromCard && !reducedMotion) {
            await animate(dialog.current, { ...displacement(), opacity: 0 }, getDdsMotionTransition(false));
        }
        dialog.current.close();
        trigger.current?.focus({ preventScroll: true });
        closing.current = false;
    };

    return (
        <>
            <Button variant={expandFromCard ? "solid" : "outline"} onClick={(event) => {
                trigger.current = event.currentTarget;
                origin.current = expandFromCard ? event.currentTarget.closest("[data-dialog-origin]") : null;
                const element = dialog.current;
                if (!element) return;
                element.style.transform = "none";
                element.style.opacity = "1";
                element.showModal();
                targetBounds.current = element.getBoundingClientRect();
                if (expandFromCard && !reducedMotion) {
                    const from = displacement();
                    playback.current = animate(element, {
                        x: [from.x, 0], y: [from.y, 0],
                        scaleX: [from.scaleX, 1], scaleY: [from.scaleY, 1], opacity: [0.5, 1],
                    }, getDdsMotionTransition(false));
                }
            }}>{label}</Button>
            <dialog
                ref={dialog}
                className="dds-detail-dialog"
                aria-labelledby={titleId}
                data-expanding={expandFromCard}
                onCancel={(event) => { event.preventDefault(); void close(); }}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    if (event.clientX < bounds.left || event.clientX > bounds.right ||
                        event.clientY < bounds.top || event.clientY > bounds.bottom) void close();
                }}
            >
                <header className="dds-detail-dialog-header">
                    <h3 id={titleId} className="font-section-title">{title}</h3>
                    <IconButton variant="text" aria-label="Close details" onClick={() => void close()}>
                        <X size={20} />
                    </IconButton>
                </header>
                <div className="dds-detail-dialog-content">{children}</div>
            </dialog>
        </>
    );
}
