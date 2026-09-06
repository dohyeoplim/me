"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import IconButton from "../IconButton";
import { ddsModalStyle, getDdsMotionTransition } from "../Motion";
import "./sheet.css";
import "../Motion/dialog.css";

type Props = {
    open: boolean; title: string; children: ReactNode; onClose: () => void; beforeClose?: () => boolean;
    size?: "default" | "wide";
};

export default function Sheet({ open, title, children, onClose, beforeClose, size = "default" }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const closing = useRef(false);
    const playback = useRef<{ stop: () => void } | null>(null);
    const operation = useRef<symbol | null>(null);
    const [, animate] = useAnimate();
    const reducedMotion = useReducedMotion();
    const titleId = useId();

    useEffect(() => {
        const element = dialog.current;
        if (!element) return;
        const current = Symbol();
        operation.current = current;
        closing.current = false;
        playback.current?.stop();
        if (!open) {
            if (!element.open) return;
            closing.current = true;
            element.dataset.closing = "true";
            const animation = animate(element, { x: reducedMotion ? 0 : "100%", opacity: 0 },
                getDdsMotionTransition(reducedMotion));
            playback.current = animation;
            void animation.then(() => {
                if (operation.current !== current) return;
                element.close();
                closing.current = false;
            });
        } else {
            const entering = !element.open;
            delete element.dataset.closing;
            if (entering) element.showModal();
            playback.current = animate(element, entering
                ? { x: [reducedMotion ? 0 : "100%", 0], opacity: [0, 1] }
                : { x: 0, opacity: 1 }, getDdsMotionTransition(reducedMotion));
        }
        return () => { operation.current = null; playback.current?.stop(); };
    }, [open, reducedMotion, animate]);

    const close = async () => {
        const element = dialog.current;
        if (!element?.open || closing.current || beforeClose?.() === false) return;
        closing.current = true;
        const current = Symbol();
        operation.current = current;
        playback.current?.stop();
        element.dataset.closing = "true";
        const animation = animate(element, { x: reducedMotion ? 0 : "100%", opacity: 0 },
            getDdsMotionTransition(reducedMotion));
        playback.current = animation;
        await animation;
        if (operation.current !== current || dialog.current !== element) return;
        element.close();
        closing.current = false;
        if (dialog.current) onClose();
    };

    return <dialog ref={dialog} className="dds-sheet dds-modal-motion" style={ddsModalStyle}
        data-size={size} aria-labelledby={titleId}
        onCancel={(event) => { event.preventDefault(); void close(); }}
        onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right) void close();
        }}>
        <header className="dds-sheet-header">
            <h2 id={titleId} className="font-work-title">{title}</h2>
            <IconButton variant="text" aria-label="Close details" onClick={() => void close()}>
                <X size={20} />
            </IconButton>
        </header>
        <div className="dds-sheet-content">{children}</div>
    </dialog>;
}
