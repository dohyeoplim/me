"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { usePathname } from "next/navigation";

type BackNav = {
    previous: string | null;
    markBack: () => void;
};

const BackNavContext = createContext<BackNav>({
    previous: null,
    markBack: () => {},
});

export const useBackNav = () => useContext(BackNavContext);

export function PreviousPathProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const stackRef = useRef<string[]>([]);
    const poppingRef = useRef(false);
    const [previous, setPrevious] = useState<string | null>(null);

    useEffect(() => {
        const stack = stackRef.current;
        if (stack[stack.length - 1] === pathname) return;
        if (poppingRef.current && stack.length > 1) {
            stack.pop();
        } else {
            stack.push(pathname);
        }
        poppingRef.current = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPrevious(stack.length > 1 ? stack[stack.length - 2] : null);
    }, [pathname]);

    const markBack = () => {
        poppingRef.current = true;
    };

    return (
        <BackNavContext.Provider value={{ previous, markBack }}>
            {children}
        </BackNavContext.Provider>
    );
}
