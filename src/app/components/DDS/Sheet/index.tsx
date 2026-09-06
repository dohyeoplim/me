"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import IconButton from "../IconButton";
import { getDdsMotionTransition } from "../Motion";

type Props = { open: boolean; title: string; children: ReactNode; onClose: () => void; beforeClose?: () => boolean };

export default function Sheet({ open, title, children, onClose, beforeClose }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const closing = useRef(false);
    const [, animate] = useAnimate();
    const reducedMotion = useReducedMotion();
    const titleId = useId();

    useEffect(() => {
        const element = dialog.current;
        if (!element) return;
        if (!open) { element.close(); return; }
        if (!element.open) element.showModal();
        const animation = animate(element, { x: [reducedMotion ? 0 : "100%", 0], opacity: [0, 1] },
            getDdsMotionTransition(reducedMotion));
        return () => animation.stop();
    }, [open, reducedMotion, animate]);

    const close = async () => {
        if (!dialog.current || closing.current || beforeClose?.() === false) return;
        closing.current = true;
        await animate(dialog.current, { x: reducedMotion ? 0 : "100%", opacity: 0 },
            getDdsMotionTransition(reducedMotion));
        dialog.current?.close();
        closing.current = false;
        if (dialog.current) onClose();
    };

    return <dialog ref={dialog} className="dds-sheet" aria-labelledby={titleId}
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
