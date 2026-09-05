const ink = [15 / 255, 15 / 255, 16 / 255, 1];
const blue = [84 / 255, 122 / 255, 159 / 255, 1];
const line = [180 / 255, 180 / 255, 189 / 255, 1];
const still = (value) => ({ a: 0, k: value });

const tween = (from, to, start, end) => ({
    a: 1,
    k: [
        { t: start, s: from, e: to, o: { x: [0.22], y: [1] }, i: { x: [0.36], y: [1] } },
        { t: end, s: to },
    ],
});

const path = (vertices, closed = false) => ({
    ty: "sh",
    ks: still({
        v: vertices,
        i: vertices.map(() => [0, 0]),
        o: vertices.map(() => [0, 0]),
        c: closed,
    }),
});

const stroke = (color = ink, width = 2) => ({
    ty: "st",
    c: still(color),
    o: still(100),
    w: still(width),
    lc: 2,
    lj: 2,
    ml: 4,
});

const trim = (start, end) => ({ ty: "tm", s: still(0), e: tween([0], [100], start, end), o: still(0), m: 1 });

const layer = (name, shapes, position = still([0, 0, 0]), opacity = still(100)) => ({
    ty: 4,
    nm: name,
    ddd: 0,
    sr: 1,
    ip: 0,
    op: 90,
    st: 0,
    bm: 0,
    ks: { o: opacity, r: still(0), p: position, a: still([0, 0, 0]), s: still([100, 100, 100]) },
    shapes,
});

const composition = (name, layers) => ({
    v: "5.13.0",
    fr: 30,
    ip: 0,
    op: 90,
    w: 480,
    h: 320,
    nm: name,
    ddd: 0,
    assets: [],
    layers: layers.map((item, index) => ({ ind: index + 1, ...item })),
});

const paper = (x, y, scale = 1, start = 0) => {
    const points = [
        [0, 0],
        [64, 0],
        [88, 24],
        [88, 124],
        [0, 124],
    ];
    return layer(
        "Document",
        [
            path(
                points.map(([px, py]) => [px * scale, py * scale]),
                true,
            ),
            path(
                [
                    [64, 0],
                    [64, 24],
                    [88, 24],
                ].map(([px, py]) => [px * scale, py * scale]),
            ),
            ...[48, 66, 84].map((py) =>
                path([
                    [16 * scale, py * scale],
                    [68 * scale, py * scale],
                ]),
            ),
            stroke(ink, 1.5),
        ],
        tween([x, y + 12, 0], [x, y, 0], start, start + 14),
        tween([0], [100], start, start + 14),
    );
};

export const createProjectAnimations = () => {
    const wave = Array.from({ length: 81 }, (_, index) => {
        const envelope = Math.sin((index / 80) * Math.PI) ** 2;
        return [55 + index * 2.2, 160 + Math.sin(index * 0.78) * 48 * envelope];
    });

    const speech = composition("MochiCall, speech becomes a trip record", [
        ...[0, 1, 2].map((row) =>
            layer("Extracted trip field", [
                path([
                    [306, 126 + row * 34],
                    [390 - row * 10, 126 + row * 34],
                ]),
                stroke(row === 0 ? blue : ink, row === 0 ? 5 : 2),
                trim(28 + row * 8, 42 + row * 8),
            ]),
        ),
        layer("Speech recognition", [path(wave), stroke(ink, 2), trim(0, 24)]),
        layer("Transcription", [
            path([
                [244, 160],
                [278, 160],
            ]),
            stroke(line),
            trim(20, 32),
        ]),
    ]);

    const graph = composition("DocFusionX, related document sections form context", [
        paper(58, 95, 0.8, 0),
        paper(210, 35, 0.8, 8),
        paper(335, 160, 0.8, 16),
        layer("Cross-document references", [
            path([
                [129, 135],
                [165, 135],
                [165, 76],
                [210, 76],
            ]),
            path([
                [281, 86],
                [306, 86],
                [306, 196],
                [335, 196],
            ]),
            path([
                [129, 177],
                [165, 177],
                [165, 233],
                [335, 233],
            ]),
            stroke(blue, 2),
            trim(28, 52),
        ]),
    ]);

    const calls = composition("Collog, conversations build a continuous health record", [
        ...[0, 1, 2].map((index) =>
            layer("Conversation", [
                path(
                    Array.from({ length: 33 }, (_, step) => [
                        66 + index * 130 + step * 2.7,
                        119 + Math.sin(step * 0.75) * Math.sin((step / 32) * Math.PI) * (18 + index * 5),
                    ]),
                ),
                stroke(ink, 2),
                trim(index * 10, index * 10 + 14),
            ]),
        ),
        layer("Shared conversation context", [
            path([
                [106, 168],
                [106, 212],
                [366, 212],
                [366, 168],
            ]),
            path([
                [236, 168],
                [236, 240],
            ]),
            stroke(blue, 2),
            trim(30, 48),
        ]),
        layer("Follow-up record", [
            path([
                [196, 251],
                [276, 251],
            ]),
            stroke(ink, 3),
            trim(48, 60),
        ]),
    ]);

    const vision = composition("WONNIT, compare a space before and after use", [
        ...[0, 1].map((index) =>
            layer("Comparison frame", [
                path(
                    [
                        [48 + index * 220, 80],
                        [208 + index * 220, 80],
                        [208 + index * 220, 236],
                        [48 + index * 220, 236],
                    ],
                    true,
                ),
                stroke(line, 1.5),
            ]),
        ),
        ...[0, 1].map((index) =>
            layer("Detected object", [
                path(
                    [
                        [76 + index * 220, 160],
                        [126 + index * 220, 160],
                        [126 + index * 220, 208],
                        [76 + index * 220, 208],
                    ],
                    true,
                ),
                stroke(ink, 2),
                trim(4, 18),
            ]),
        ),
        layer("Detected change", [
            path(
                [
                    [348, 112],
                    [398, 112],
                    [398, 158],
                    [348, 158],
                ],
                true,
            ),
            stroke(blue, 2.5),
            trim(32, 50),
        ]),
        layer(
            "Comparison scan",
            [
                path([
                    [282, 98],
                    [414, 98],
                ]),
                stroke(blue, 1),
            ],
            tween([0, 0, 0], [0, 118, 0], 16, 32),
            tween([100], [0], 32, 42),
        ),
    ]);

    return { speech, calls, vision, graph };
};
