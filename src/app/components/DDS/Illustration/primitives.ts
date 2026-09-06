import type { IllustrationColor, IllustrationLayer, IllustrationScene, IllustrationShape, Point } from "./types";

export const illustrationTokens = {
    canvas: { width: 480, height: 320 },
    stroke: { detail: 2, connection: 3, emphasis: 5 },
    radius: { detail: 4, object: 10, panel: 18 },
    motion: { frames: 120, frameRate: 30, loop: true, easing: [0.25, 0.1, 0.25, 1] },
} as const;

export const rect = (
    x: number, y: number, width: number, height: number, fill: IllustrationColor,
    radius: number = illustrationTokens.radius.detail,
): IllustrationShape => ({ kind: "rect", x, y, width, height, fill, radius });

export const ellipse = (
    x: number, y: number, width: number, height: number, fill: IllustrationColor,
): IllustrationShape => ({ kind: "ellipse", x, y, width, height, fill });

export const path = (
    points: Point[], stroke: IllustrationColor = "accent", strokeWidth: number = illustrationTokens.stroke.connection,
): IllustrationShape => ({ kind: "path", points, stroke, strokeWidth });

export const filledPath = (points: Point[], fill: IllustrationColor): IllustrationShape => ({
    kind: "path", points, fill, closed: true,
});

export const scene = (label: string, layers: IllustrationLayer[]): IllustrationScene => ({
    label, ...illustrationTokens.canvas, frames: illustrationTokens.motion.frames, layers,
});
