import type { Transition } from "motion/react";
import type { CSSProperties } from "react";

export const ddsMotionTransition = {
    duration: 0.24,
    ease: [0.2, 0, 0, 1],
} as const satisfies Transition;

export const ddsModalStyle = { "--dds-modal-duration": `${ddsMotionTransition.duration}s` } as CSSProperties;

export function getDdsMotionTransition(reducedMotion: boolean | null): Transition {
    return reducedMotion ? { duration: 0 } : ddsMotionTransition;
}
