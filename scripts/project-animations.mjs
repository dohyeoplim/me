import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const palette = JSON.parse(read("../src/app/components/DDS/Illustration/palette.json"));
const definition = ts.transpileModule(read("../src/app/portfolio/_data/project-scenes.ts"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { projectScenes } = await import(`data:text/javascript;base64,${Buffer.from(definition).toString("base64")}`);
const still = (value) => ({ a: 0, k: value });
const easing = { o: { x: [0.25], y: [0.1] }, i: { x: [0.25], y: [1] } };

function animated(frames, convert, fallback) {
    if (!frames?.length) return still(fallback);
    return {
        a: 1,
        k: frames.map(({ at, value }, index) => ({
            t: at,
            s: convert(value),
            ...(frames[index + 1] ? { e: convert(frames[index + 1].value), ...easing } : {}),
        })),
    };
}

function color(name) {
    const hex = palette[name].slice(1);
    return [...[0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255), 1];
}

function geometry(shape) {
    if (shape.kind === "rect") {
        return {
            ty: "rc", d: 1,
            p: still([shape.x + shape.width / 2, shape.y + shape.height / 2]),
            s: still([shape.width, shape.height]), r: still(shape.radius),
        };
    }
    if (shape.kind === "ellipse") {
        return { ty: "el", d: 1, p: still([shape.x, shape.y]), s: still([shape.width, shape.height]) };
    }
    return {
        ty: "sh",
        ks: still({
            v: shape.points, c: shape.closed ?? false,
            i: shape.incoming ?? shape.points.map(() => [0, 0]),
            o: shape.outgoing ?? shape.points.map(() => [0, 0]),
        }),
    };
}

function group(shape, draw) {
    return {
        ty: "gr",
        it: [
            geometry(shape),
            ...(shape.fill ? [{ ty: "fl", c: still(color(shape.fill)), o: still(100), r: 1 }] : []),
            ...(shape.stroke ? [{
                ty: "st", c: still(color(shape.stroke)), o: still(100),
                w: still(shape.strokeWidth ?? 3), lc: 2, lj: 2, ml: 4,
            }] : []),
            ...(draw ? [{
                ty: "tm", s: still(0), e: animated(draw, (value) => [value * 100], 100), o: still(0), m: 1,
            }] : []),
            { ty: "tr", p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100) },
        ],
    };
}

function composition(scene) {
    return {
        v: "5.13.0", fr: 30, ip: 0, op: scene.frames, w: scene.width, h: scene.height,
        nm: scene.label, ddd: 0, assets: [],
        layers: scene.layers.toReversed().map(({ name, shapes, origin = [0, 0], motion }, index) => ({
            ty: 4, ind: index + 1, nm: name, ddd: 0, sr: 1, ip: 0, op: scene.frames, st: 0, bm: 0,
            ks: {
                o: animated(motion?.opacity, (value) => [value * 100], 100),
                r: still(0),
                p: animated(motion?.position, ([x, y]) => [x + origin[0], y + origin[1], 0], [...origin, 0]),
                a: still([...origin, 0]),
                s: animated(motion?.scale, ([x, y]) => [x * 100, y * 100, 100], [100, 100, 100]),
            },
            shapes: shapes.toReversed().map((shape) => group(shape, motion?.draw)),
        })),
    };
}

export const createProjectAnimations = () => Object.fromEntries(
    Object.entries(projectScenes).map(([name, scene]) => [name, composition(scene)]),
);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href && process.argv.includes("--write")) {
    for (const [name, animation] of Object.entries(createProjectAnimations())) {
        const target = new URL(`../public/animations/${name}.json`, import.meta.url);
        writeFileSync(target, JSON.stringify(animation, null, 2) + "\n");
    }
    console.log("Updated project animations.");
}
