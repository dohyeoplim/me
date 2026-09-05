"use client";

import { useEffect, useRef, type PointerEvent } from "react";

type Props = {
    onScroll: (deltaY: number) => void;
};

export default function ScrollBridge({ onScroll }: Props) {
    const bridge = useRef<HTMLDivElement>(null);
    const pointer = useRef<{ id: number; y: number } | null>(null);

    useEffect(() => {
        const element = bridge.current;
        if (!element) return;

        const handleWheel = (event: globalThis.WheelEvent) => {
            const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight) || 16;
            let scale = 1;
            if (event.deltaMode === globalThis.WheelEvent.DOM_DELTA_LINE) scale = lineHeight;
            if (event.deltaMode === globalThis.WheelEvent.DOM_DELTA_PAGE) {
                scale = element.ownerDocument.documentElement.clientHeight;
            }
            event.preventDefault();
            onScroll(event.deltaY * scale);
        };

        element.addEventListener("wheel", handleWheel, { passive: false });
        return () => element.removeEventListener("wheel", handleWheel);
    }, [onScroll]);

    function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType !== "touch") return;
        pointer.current = { id: event.pointerId, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
        if (pointer.current?.id !== event.pointerId) return;
        event.preventDefault();
        onScroll(pointer.current.y - event.clientY);
        pointer.current = { id: event.pointerId, y: event.clientY };
    }

    function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
        if (pointer.current?.id !== event.pointerId) return;
        pointer.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    return (
        <div
            ref={bridge}
            className="dds-chat-scroll-bridge"
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
        />
    );
}
