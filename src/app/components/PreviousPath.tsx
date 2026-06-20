"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

const PreviousPathContext = createContext<string | null>(null);

export const usePreviousPath = () => useContext(PreviousPathContext);

export function PreviousPathProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [prev, setPrev] = useState<string | null>(null);
    const [current, setCurrent] = useState(pathname);

    if (pathname !== current) {
        setPrev(current);
        setCurrent(pathname);
    }

    return (
        <PreviousPathContext.Provider value={prev}>
            {children}
        </PreviousPathContext.Provider>
    );
}
