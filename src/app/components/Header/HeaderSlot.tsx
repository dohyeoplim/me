"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type SlotContextValue = {
    node: HTMLElement | null;
    setNode: (node: HTMLElement | null) => void;
};

const SlotContext = createContext<SlotContextValue | null>(null);

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
    const [node, setNode] = useState<HTMLElement | null>(null);
    return (
        <SlotContext.Provider value={{ node, setNode }}>
            {children}
        </SlotContext.Provider>
    );
}

export function useHeaderSlotRef() {
    return useContext(SlotContext)?.setNode ?? (() => {});
}

export function HeaderActions({ children }: { children: ReactNode }) {
    const node = useContext(SlotContext)?.node ?? null;
    return node ? createPortal(children, node) : null;
}
