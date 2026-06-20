"use client";

import { useEffect } from "react";

export function useOverlay(
    active: boolean,
    onClose: () => void,
    lockScroll = false,
) {
    useEffect(() => {
        if (!active) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        if (lockScroll) document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            if (lockScroll) document.body.style.overflow = "";
        };
    }, [active, onClose, lockScroll]);
}
