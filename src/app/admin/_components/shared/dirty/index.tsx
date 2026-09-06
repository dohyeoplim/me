"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DirtyValue = {
    dirty: boolean;
    setDirty: (dirty: boolean) => void;
};

const DirtyContext = createContext<DirtyValue>({
    dirty: false,
    setDirty: () => {},
});

export function DirtyProvider({ children }: { children: React.ReactNode }) {
    const [dirty, setDirty] = useState(false);
    return (
        <DirtyContext.Provider value={{ dirty, setDirty }}>
            {children}
        </DirtyContext.Provider>
    );
}

export function useRegisterDirty(dirty: boolean) {
    const { setDirty } = useContext(DirtyContext);
    useEffect(() => {
        setDirty(dirty);
        return () => setDirty(false);
    }, [dirty, setDirty]);
}

export function useDirty() {
    return useContext(DirtyContext).dirty;
}
