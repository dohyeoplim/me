import type {
    IllustrationColor, IllustrationLayer, IllustrationScene, IllustrationShape, Point,
} from "@/app/components/DDS/Illustration/types";

const rect = (
    x: number, y: number, width: number, height: number, fill: IllustrationColor, radius = 4,
): IllustrationShape => ({ kind: "rect", x, y, width, height, fill, radius });

const ellipse = (x: number, y: number, width: number, height: number, fill: IllustrationColor): IllustrationShape => ({
    kind: "ellipse", x, y, width, height, fill,
});

const path = (points: Point[], stroke: IllustrationColor = "accent", strokeWidth = 3): IllustrationShape => ({
    kind: "path", points, stroke, strokeWidth,
});

const filledPath = (points: Point[], fill: IllustrationColor): IllustrationShape => ({
    kind: "path", points, fill, closed: true,
});

const voice = (x: number, y: number): IllustrationLayer[] => [20, 36, 52, 36, 20].map((height, index) => ({
    name: `Voice ${index}`,
    shapes: [rect(x + index * 14, y - height / 2, 7, height, "accent", 3.5)],
    origin: [x + index * 14 + 3.5, y],
    motion: {
        scale: [
            { at: 0, value: [1, 0.7] },
            { at: 12 + index * 2, value: [1, 1] },
            { at: 26 + index * 2, value: [1, 0.45] },
            { at: 44 + index * 2, value: [1, 1] },
        ],
    },
}));

const paper = (x: number, y: number): IllustrationShape[] => [
    { ...rect(x, y, 72, 104, "paper", 10), stroke: "line", strokeWidth: 2 },
    rect(x + 16, y + 24, 32, 6, "ink", 3),
    rect(x + 16, y + 46, 40, 5, "line", 2.5),
    rect(x + 16, y + 62, 30, 5, "line", 2.5),
];

const scene = (label: string, layers: IllustrationLayer[]): IllustrationScene => ({
    label, width: 480, height: 320, frames: 120, layers,
});

export const projectScenes = {
    speech: scene("A spoken request becomes a hospital transportation trip", [
        { name: "Trip route", shapes: [path([[122, 222], [396, 222]], "line", 3)] },
        {
            name: "Hospital",
            shapes: [
                rect(332, 88, 76, 134, "paper", 10),
                rect(355, 114, 30, 9, "accent", 2),
                rect(366, 103, 9, 31, "accent", 2),
                rect(361, 195, 18, 27, "soft", 3),
            ],
        },
        ...voice(94, 154),
        {
            name: "Transportation",
            shapes: [
                filledPath([[260, 174], [316, 174], [344, 194], [344, 214], [260, 214]], "accent"),
                filledPath([[310, 182], [315, 182], [333, 195], [310, 195]], "paper"),
                ellipse(276, 214, 17, 17, "ink"),
                ellipse(328, 214, 17, 17, "ink"),
            ],
            motion: { position: [{ at: 14, value: [-72, 0] }, { at: 78, value: [0, 0] }] },
        },
    ]),
    calls: scene("Audio from a family call becomes a health record", [
        {
            name: "Phone",
            shapes: [
                { ...rect(88, 70, 112, 178, "paper", 18), stroke: "line", strokeWidth: 2.5 },
                rect(130, 82, 28, 4, "line", 2),
            ],
        },
        ...voice(112, 156),
        {
            name: "Extraction",
            shapes: [path([[222, 156], [256, 156]], "line", 3), path([[248, 149], [256, 156], [248, 163]], "line", 3)],
            motion: { draw: [{ at: 16, value: 0 }, { at: 38, value: 1 }] },
        },
        {
            name: "Health",
            origin: [334, 138],
            shapes: [{
                kind: "path", fill: "accent", closed: true,
                points: [[334, 176], [286, 122], [334, 114], [382, 122]],
                incoming: [[14, -12], [0, 24], [-16, -24], [0, -28]],
                outgoing: [[-14, -12], [0, -28], [16, -24], [0, 24]],
            }],
            motion: { scale: [{ at: 28, value: [0.92, 0.92] }, { at: 54, value: [1, 1] }] },
        },
        {
            name: "Health record",
            shapes: [rect(295, 204, 78, 7, "ink", 3.5), rect(309, 221, 50, 6, "line", 3)],
            motion: { opacity: [{ at: 32, value: 0.35 }, { at: 62, value: 1 }] },
        },
    ]),
    vision: scene("A chair and a plant are checked within a shared space", [
        { name: "Room", shapes: [rect(76, 58, 328, 210, "paper", 18)] },
        {
            name: "Chair",
            shapes: [
                path([[148, 193], [148, 234]], "ink", 5),
                path([[204, 193], [204, 234]], "ink", 5),
                rect(146, 127, 62, 53, "ink", 14),
                rect(136, 187, 82, 13, "ink", 6),
            ],
        },
        {
            name: "Plant",
            shapes: [
                path([[318, 141], [318, 196]], "accent", 4),
                {
                    kind: "path", fill: "accent", closed: true,
                    points: [[318, 166], [285, 124]],
                    incoming: [[0, -22], [-5, 18]], outgoing: [[-31, 0], [24, 6]],
                },
                {
                    kind: "path", fill: "accent", closed: true,
                    points: [[318, 150], [348, 108]],
                    incoming: [[0, -22], [5, 18]], outgoing: [[29, 0], [-23, 6]],
                },
                filledPath([[297, 193], [339, 193], [332, 234], [304, 234]], "accent"),
            ],
        },
        {
            name: "Space verification",
            shapes: [
                path([[110, 118], [110, 94], [134, 94]]),
                path([[346, 94], [370, 94], [370, 118]]),
                path([[110, 222], [110, 246], [134, 246]]),
                path([[346, 246], [370, 246], [370, 222]]),
            ],
            motion: { opacity: [{ at: 18, value: 0.25 }, { at: 55, value: 1 }] },
        },
        {
            name: "Verified",
            shapes: [path([[348, 72], [358, 82], [378, 62]], "accent", 4)],
            motion: { draw: [{ at: 52, value: 0 }, { at: 76, value: 1 }] },
        },
    ]),
    graph: scene("Related document sections provide retrieval context", [
        {
            name: "Document relationships",
            shapes: [path([[134, 157], [218, 104], [340, 186]], "accent", 3)],
            motion: { draw: [{ at: 14, value: 0 }, { at: 62, value: 1 }] },
        },
        { name: "First document", shapes: paper(66, 113) },
        { name: "Second document", shapes: paper(214, 58) },
        { name: "Third document", shapes: paper(338, 158) },
    ]),
};

export const projectAnimationSrc = (kind: keyof typeof projectScenes) => `/animations/${kind}.json?v=2`;
