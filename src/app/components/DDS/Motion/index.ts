import type { Transition } from "motion/react";

export const ddsMotionTransition = {
    duration: 0.24,
    ease: [0.2, 0, 0, 1],
} as const satisfies Transition;

export function getDdsMotionTransition(reducedMotion: boolean | null): Transition {
    return reducedMotion ? { duration: 0 } : ddsMotionTransition;
}
