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
    driving: scene("Near, middle, and far depth features are pooled independently into three feature vectors",
        (["line", "accent", "ink"] as const).flatMap((color, index): IllustrationLayer[] => {
            const y = 116 + index * 34;
            const shift = (index - 1) * 22;
            return [
                {
                    name: `Depth group ${index}`,
                    shapes: [0, 1, 2].map((column) => rect(88 + column * 38, y, 30, 30, color, 5)),
                    motion: { position: [
                        { at: 0, value: [0, 0] }, { at: 12, value: [0, 0] },
                        { at: 40, value: [0, shift] }, { at: 84, value: [0, shift] },
                        { at: 112, value: [0, 0] }, { at: 120, value: [0, 0] },
                    ] },
                },
                {
                    name: `Independent pooling ${index}`,
                    shapes: [path([[216, y + shift + 15], [306, y + shift + 15]], color, 3)],
                    motion: { draw: [
                        { at: 0, value: 0 }, { at: 38, value: 0 }, { at: 64, value: 1 },
                        { at: 84, value: 1 }, { at: 104, value: 0 }, { at: 120, value: 0 },
                    ] },
                },
                {
                    name: `Pooled vector ${index}`,
                    shapes: [rect(330, y + shift + 1, 62, 28, color, 6)],
                    motion: { opacity: [
                        { at: 0, value: 0.2 }, { at: 54, value: 0.2 }, { at: 72, value: 1 },
                        { at: 88, value: 1 }, { at: 112, value: 0.2 }, { at: 120, value: 0.2 },
                    ] },
                },
            ];
        }),
    ),
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
        ...[
            { name: "Chair", left: 124, right: 230, top: 115, start: 6 },
            { name: "Plant", left: 274, right: 360, top: 96, start: 44 },
        ].flatMap(({ name, left, right, top, start }): IllustrationLayer[] => [
            {
                name: `${name} detection`,
                shapes: [
                    path([[left, top + 16], [left, top], [left + 16, top]]),
                    path([[right - 16, top], [right, top], [right, top + 16]]),
                    path([[left, 230], [left, 246], [left + 16, 246]]),
                    path([[right - 16, 246], [right, 246], [right, 230]]),
                ],
                motion: { opacity: [
                    { at: 0, value: 0 }, { at: start, value: 0 }, { at: start + 10, value: 1 },
                    { at: 102, value: 1 }, { at: 120, value: 0 },
                ] },
            },
            {
                name: `${name} scan`,
                shapes: [path([[left + 6, top + 6], [right - 6, top + 6]], "accent", 2)],
                motion: {
                    position: [{ at: start, value: [0, 0] }, { at: start + 32, value: [0, 234 - top] }],
                    opacity: [
                        { at: 0, value: 0 }, { at: start, value: 0 }, { at: start + 5, value: 0.7 },
                        { at: start + 28, value: 0.7 }, { at: start + 34, value: 0 },
                    ],
                },
            },
        ]),
    ]),
    graph: scene("Selected fields from three documents are linked into a retrieved answer", [
        {
            name: "Document relationships",
            shapes: [
                path([[122, 140], [240, 222]], "accent", 3),
                path([[240, 146], [240, 222]], "accent", 3),
                path([[354, 140], [240, 222]], "accent", 3),
            ],
            motion: { draw: [
                { at: 0, value: 0 }, { at: 38, value: 0 }, { at: 72, value: 1 },
                { at: 100, value: 1 }, { at: 120, value: 0 },
            ] },
        },
        { name: "Text document", shapes: paper(50, 76) },
        { name: "Structured form", shapes: [
            { ...rect(204, 42, 72, 104, "paper", 10), stroke: "line", strokeWidth: 2 },
            rect(218, 62, 22, 5, "ink", 2),
            rect(218, 82, 44, 16, "soft", 3), rect(218, 106, 44, 16, "soft", 3),
        ] },
        { name: "Table document", shapes: [
            { ...rect(354, 76, 72, 104, "paper", 10), stroke: "line", strokeWidth: 2 },
            rect(368, 94, 32, 5, "ink", 2),
            ...[0, 1, 2].flatMap((row) => [
                rect(368, 112 + row * 16, 16, 10, "soft", 2),
                rect(390, 112 + row * 16, 22, 10, "line", 2),
            ]),
        ] },
        ...[
            { x: 66, y: 122, width: 40 }, { x: 218, y: 86, width: 44 }, { x: 390, y: 128, width: 22 },
        ].map(({ x, y, width }, index): IllustrationLayer => ({
            name: `Retrieved field ${index}`,
            shapes: [rect(x, y, width, 6, "accent", 3)],
            motion: { opacity: [
                { at: 0, value: 0 }, { at: 8 + index * 12, value: 0 }, { at: 24 + index * 12, value: 1 },
                { at: 100, value: 1 }, { at: 120, value: 0 },
            ] },
        })),
        {
            name: "Retrieved answer",
            shapes: [
                rect(178, 222, 124, 56, "paper", 10),
                rect(194, 238, 78, 6, "accent", 3), rect(194, 253, 56, 5, "line", 2.5),
            ],
            motion: { opacity: [
                { at: 0, value: 0.2 }, { at: 66, value: 0.2 }, { at: 84, value: 1 },
                { at: 100, value: 1 }, { at: 120, value: 0.2 },
            ] },
        },
    ]),
};

export const projectAnimationSrc = (kind: keyof typeof projectScenes) => `/animations/${kind}.json?v=4`;
