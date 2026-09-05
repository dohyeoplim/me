"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { cn } from "@/app/lib/utils";

export default function Reveal({ className, ...props }: ComponentProps<"div">) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || !window.IntersectionObserver) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setVisible(true);
                observer.disconnect();
            },
            { threshold: 0.08 },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return <div ref={ref} data-visible={visible} className={cn("scroll-reveal", className)} {...props} />;
}
