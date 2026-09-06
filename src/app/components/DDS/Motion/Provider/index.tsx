"use client";

import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

const loadLayoutFeatures = () => import("./features").then((module) => module.default);

export default function MotionProvider({ children }: { children: ReactNode }) {
    return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function LayoutMotion({ children }: { children: ReactNode }) {
    return <LazyMotion features={loadLayoutFeatures} strict>{children}</LazyMotion>;
}
