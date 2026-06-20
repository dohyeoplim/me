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

type NavEntry = { index: number };
type NavigateEvent = { navigationType: string; destination?: NavEntry };
type NavigationLike = {
    currentEntry?: NavEntry;
    addEventListener: (type: string, cb: (e: NavigateEvent) => void) => void;
    removeEventListener: (type: string, cb: (e: NavigateEvent) => void) => void;
};

export function PreviousPathProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const stackRef = useRef<string[]>([]);
    const poppingRef = useRef(false);
    const traverseRef = useRef<"back" | "forward" | null>(null);
    const [previous, setPrevious] = useState<string | null>(null);

    useEffect(() => {
        const nav = (window as unknown as { navigation?: NavigationLike })
            .navigation;
        if (!nav) return;
        const onNavigate = (e: NavigateEvent) => {
            if (e.navigationType !== "traverse") return;
            const from = nav.currentEntry?.index ?? 0;
            const to = e.destination?.index ?? from;
            traverseRef.current = to < from ? "back" : "forward";
        };
        nav.addEventListener("navigate", onNavigate);
        return () => nav.removeEventListener("navigate", onNavigate);
    }, []);

    useEffect(() => {
        const stack = stackRef.current;
        if (stack[stack.length - 1] === pathname) return;
        const isBack =
            poppingRef.current || traverseRef.current === "back";
        poppingRef.current = false;
        traverseRef.current = null;
        if (isBack && stack.length > 1) stack.pop();
        else stack.push(pathname);
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
