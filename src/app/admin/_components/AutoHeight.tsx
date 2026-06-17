"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
    children: ReactNode;
    className?: string;
};

export default function AutoHeight({ children, className }: Props) {
    const inner = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | "auto">("auto");
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const el = inner.current;
        if (!el) return;
        const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            className={className}
            initial={false}
            animate={{ height }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onAnimationStart={() => setAnimating(true)}
            onAnimationComplete={() => setAnimating(false)}
            style={{ overflow: animating ? "hidden" : "visible" }}
        >
            <div ref={inner}>{children}</div>
        </motion.div>
    );
}
