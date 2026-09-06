import type palette from "./palette.json";

export type Point = [number, number];
export type IllustrationColor = keyof typeof palette;
export type Keyframe<T> = { at: number; value: T };

type ShapeStyle = {
    fill?: IllustrationColor;
    stroke?: IllustrationColor;
    strokeWidth?: number;
};

export type IllustrationShape = ShapeStyle & (
    | { kind: "rect"; x: number; y: number; width: number; height: number; radius: number }
    | { kind: "ellipse"; x: number; y: number; width: number; height: number }
    | { kind: "path"; points: Point[]; closed?: boolean; incoming?: Point[]; outgoing?: Point[] }
);

export type IllustrationLayer = {
    name: string;
    shapes: IllustrationShape[];
    origin?: Point;
    motion?: {
        position?: Keyframe<Point>[];
        scale?: Keyframe<Point>[];
        opacity?: Keyframe<number>[];
        draw?: Keyframe<number>[];
    };
};

export type IllustrationScene = {
    label: string;
    width: number;
    height: number;
    frames: number;
    layers: IllustrationLayer[];
};
