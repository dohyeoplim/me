const ink = [15 / 255, 15 / 255, 16 / 255, 1];
const blue = [84 / 255, 122 / 255, 159 / 255, 1];
const line = [180 / 255, 180 / 255, 189 / 255, 1];
const still = (value) => ({ a: 0, k: value });
const easing = { o: { x: [0.22], y: [1] }, i: { x: [0.36], y: [1] } };

const tween = (from, to, start, end) => ({
    a: 1,
    k: [
        { t: start, s: from, e: to, ...easing },
        { t: end, s: to },
    ],
});

const path = (vertices, closed = false, name) => ({
    ty: "sh",
    ...(name ? { nm: name } : {}),
    ks: still({
        v: vertices,
        i: vertices.map(() => [0, 0]),
        o: vertices.map(() => [0, 0]),
        c: closed,
    }),
});

const namedPath = (name, vertices, closed = false) => path(vertices, closed, name);

const rectangle = (name, position, size, radius = 0) => ({
    ty: "rc",
    nm: name,
    d: 1,
    p: still(position),
    s: still(size),
    r: still(radius),
});

const ellipse = (name, position, size) => ({
    ty: "el",
    nm: name,
    d: 1,
    p: still(position),
    s: still(size),
});

const stroke = (color = ink, width = 2, opacity = 100) => ({
    ty: "st",
    c: still(color),
    o: still(opacity),
    w: still(width),
    lc: 2,
    lj: 2,
    ml: 4,
});

const trim = (start, end) => ({
    ty: "tm",
    s: still(0),
    e: tween([0], [100], start, end),
    o: still(0),
    m: 1,
});

const layer = (name, shapes, position = still([0, 0, 0]), opacity = still(100)) => ({
    ty: 4,
    nm: name,
    ddd: 0,
    sr: 1,
    ip: 0,
    op: 90,
    st: 0,
    bm: 0,
    ks: {
        o: opacity,
        r: still(0),
        p: position,
        a: still([0, 0, 0]),
        s: still([100, 100, 100]),
    },
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
            stroke(ink, 2.5),
        ],
        tween([x, y + 12, 0], [x, y, 0], start, start + 14),
        tween([0], [100], start, start + 14),
    );
};

const createSpeechAnimation = () =>
    composition("MochiCall, a hospital transport request from speech", [
        layer("Regional destination", [
            ellipse("Location marker", [386, 94], [36, 36]),
            ellipse("Location point", [386, 94], [8, 8]),
            namedPath("Location tail", [
                [373, 106],
                [386, 128],
                [399, 106],
            ]),
            stroke(blue, 3.25),
            trim(50, 68),
        ]),
        layer("Transport request", [
            namedPath("Request waveform", [
                [160, 168],
                [181, 168],
                [190, 154],
                [200, 184],
                [211, 142],
                [223, 188],
                [235, 151],
                [247, 181],
                [258, 160],
                [269, 174],
                [282, 168],
                [294, 168],
            ]),
            namedPath("Request arrow", [
                [286, 160],
                [294, 168],
                [286, 176],
            ]),
            stroke(blue, 3.25),
            trim(20, 48),
        ]),
        layer("Regional transport vehicle", [
            namedPath(
                "Vehicle body",
                [
                    [294, 158],
                    [380, 158],
                    [414, 184],
                    [420, 218],
                    [294, 218],
                ],
                true,
            ),
            namedPath(
                "Windshield",
                [
                    [372, 166],
                    [395, 166],
                    [409, 184],
                    [372, 184],
                ],
                true,
            ),
            namedPath(
                "Door",
                [
                    [318, 170],
                    [354, 170],
                    [354, 218],
                    [318, 218],
                ],
                true,
            ),
            ellipse("Rear wheel", [320, 220], [28, 28]),
            ellipse("Front wheel", [392, 220], [28, 28]),
            namedPath("Wheel hubs", [
                [316, 220],
                [324, 220],
            ]),
            namedPath("Wheel hubs", [
                [388, 220],
                [396, 220],
            ]),
            stroke(ink, 3),
            trim(34, 62),
        ]),
        layer("Hospital", [
            rectangle("Hospital building", [108, 170], [100, 138], 7),
            namedPath("Entrance", [
                [91, 238],
                [91, 194],
                [125, 194],
                [125, 238],
            ]),
            namedPath("Medical cross", [
                [108, 122],
                [108, 154],
            ]),
            namedPath("Medical cross", [
                [92, 138],
                [124, 138],
            ]),
            namedPath("Windows", [
                [78, 174],
                [90, 174],
            ]),
            namedPath("Windows", [
                [126, 174],
                [138, 174],
            ]),
            stroke(ink, 3),
            trim(0, 26),
        ]),
        layer("Ground route", [
            namedPath("Ground", [
                [54, 240],
                [426, 240],
            ]),
            namedPath("Regional route", [
                [160, 240],
                [184, 250],
                [222, 232],
                [258, 246],
                [294, 240],
            ]),
            stroke(line, 2.5),
            trim(10, 34),
        ]),
    ]);

const createCallsAnimation = () =>
    composition("Collog, phone audio becomes health information", [
        layer("Health information accent", [
            namedPath("Medical cross", [
                [306, 90],
                [306, 110],
            ]),
            namedPath("Medical cross", [
                [296, 100],
                [316, 100],
            ]),
            ellipse("Health marker", [306, 100], [34, 34]),
            stroke(blue, 3),
            trim(51, 68),
        ]),
        layer("Health information", [
            namedPath("Header divider", [
                [278, 124],
                [422, 124],
            ]),
            ellipse("First field", [302, 151], [8, 8]),
            namedPath("First field", [
                [320, 151],
                [394, 151],
            ]),
            ellipse("Second field", [302, 180], [8, 8]),
            namedPath("Second field", [
                [320, 180],
                [380, 180],
            ]),
            ellipse("Third field", [302, 209], [8, 8]),
            namedPath("Third field", [
                [320, 209],
                [400, 209],
            ]),
            stroke(ink, 2.75),
            trim(48, 74),
        ]),
        layer("Health record", [
            rectangle("Health card", [350, 160], [148, 166], 12),
            stroke(line, 2.5),
            trim(38, 60),
        ]),
        layer("Extracted audio", [
            namedPath("Audio to record", [
                [178, 160],
                [194, 160],
                [202, 148],
                [210, 174],
                [219, 142],
                [229, 177],
                [239, 151],
                [248, 169],
                [258, 160],
                [270, 160],
            ]),
            namedPath("Extraction arrow", [
                [262, 152],
                [270, 160],
                [262, 168],
            ]),
            stroke(blue, 3.25),
            trim(18, 46),
        ]),
        layer("Phone audio", [
            namedPath("Phone waveform", [
                [82, 160],
                [92, 160],
                [98, 148],
                [105, 176],
                [113, 137],
                [122, 181],
                [131, 143],
                [140, 174],
                [148, 153],
                [156, 166],
            ]),
            stroke(ink, 3.25),
            trim(10, 34),
        ]),
        layer("Phone", [
            rectangle("Phone body", [118, 160], [120, 184], 18),
            namedPath("Speaker", [
                [101, 88],
                [135, 88],
            ]),
            ellipse("Home indicator", [118, 228], [8, 8]),
            stroke(ink, 3),
            trim(0, 24),
        ]),
    ]);

const createVisionAnimation = () => {
    const scanOpacity = {
        a: 1,
        k: [
            { t: 12, s: [0], e: [80], ...easing },
            { t: 17, s: [80], e: [80], ...easing },
            { t: 40, s: [80], e: [0], ...easing },
            { t: 46, s: [0] },
        ],
    };

    return composition("WONNIT, chair and plant validation in a shared room", [
        layer(
            "Room scan",
            [
                namedPath("Scan line", [
                    [84, 82],
                    [396, 82],
                ]),
                stroke(blue, 2.5, 80),
            ],
            tween([0, 0, 0], [0, 150, 0], 12, 40),
            scanOpacity,
        ),
        layer("Validation checks", [
            namedPath("Chair check", [
                [201, 105],
                [207, 111],
                [219, 97],
            ]),
            namedPath("Plant check", [
                [353, 97],
                [359, 103],
                [371, 89],
            ]),
            stroke(blue, 3.25),
            trim(54, 68),
        ]),
        layer("Detection regions", [
            rectangle("Chair detection", [160, 168], [132, 152], 8),
            rectangle("Plant detection", [320, 164], [120, 160], 8),
            stroke(blue, 3),
            trim(38, 60),
        ]),
        layer("Chair", [
            rectangle("Chair back", [157, 153], [64, 56], 6),
            namedPath(
                "Chair seat",
                [
                    [112, 183],
                    [202, 183],
                    [192, 199],
                    [122, 199],
                ],
                true,
            ),
            namedPath("Chair legs", [
                [130, 199],
                [124, 232],
            ]),
            namedPath("Chair legs", [
                [184, 199],
                [192, 232],
            ]),
            namedPath("Chair arms", [
                [112, 162],
                [112, 192],
            ]),
            namedPath("Chair arms", [
                [202, 162],
                [202, 192],
            ]),
            stroke(ink, 3),
            trim(7, 31),
        ]),
        layer("Plant", [
            namedPath("Stem", [
                [322, 190],
                [322, 119],
            ]),
            namedPath(
                "Left leaf",
                [
                    [322, 145],
                    [292, 126],
                    [298, 158],
                    [322, 170],
                ],
                true,
            ),
            namedPath(
                "Right leaf",
                [
                    [322, 132],
                    [351, 111],
                    [346, 145],
                    [322, 158],
                ],
                true,
            ),
            namedPath(
                "Top leaf",
                [
                    [322, 134],
                    [310, 104],
                    [322, 88],
                    [334, 104],
                ],
                true,
            ),
            namedPath(
                "Plant pot",
                [
                    [292, 190],
                    [352, 190],
                    [342, 232],
                    [302, 232],
                ],
                true,
            ),
            stroke(ink, 3),
            trim(14, 38),
        ]),
        layer("Shared room", [
            namedPath(
                "Room frame",
                [
                    [58, 58],
                    [422, 58],
                    [422, 248],
                    [58, 248],
                ],
                true,
            ),
            namedPath("Floor line", [
                [58, 216],
                [422, 216],
            ]),
            namedPath("Floor perspective", [
                [58, 248],
                [112, 216],
            ]),
            namedPath("Floor perspective", [
                [422, 248],
                [368, 216],
            ]),
            stroke(line, 2.5),
            trim(0, 22),
        ]),
    ]);
};

const createGraphAnimation = () =>
    composition("DocFusionX, related document sections form context", [
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
            stroke(blue, 3.25),
            trim(28, 52),
        ]),
    ]);

export const createProjectAnimations = () => ({
    speech: createSpeechAnimation(),
    calls: createCallsAnimation(),
    vision: createVisionAnimation(),
    graph: createGraphAnimation(),
});
