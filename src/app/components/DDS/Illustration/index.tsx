import palette from "./palette.json";
import type { IllustrationScene, IllustrationShape, Point } from "./types";

function pathData(shape: Extract<IllustrationShape, { kind: "path" }>) {
    const [first] = shape.points;
    if (!first) return "";
    const segments = [`M${first.join(" ")}`];
    const count = shape.points.length + (shape.closed ? 1 : 0);

    for (let index = 1; index < count; index++) {
        const current = shape.points[index % shape.points.length];
        const previous = shape.points[index - 1];
        if (!current || !previous) continue;
        const incoming = shape.incoming?.[index % shape.points.length] ?? [0, 0];
        const outgoing = shape.outgoing?.[index - 1] ?? [0, 0];
        const control = (point: Point, tangent: number[]) => point.map((value, axis) => value + (tangent[axis] ?? 0));
        segments.push(`C${control(previous, outgoing)} ${control(current, incoming)} ${current}`);
    }
    return segments.join(" ") + (shape.closed ? " Z" : "");
}

function Shape({ shape }: { shape: IllustrationShape }) {
    const style = {
        fill: shape.fill ? palette[shape.fill] : "none",
        stroke: shape.stroke ? palette[shape.stroke] : "none",
        strokeWidth: shape.strokeWidth ?? 3,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };
    if (shape.kind === "path") return <path d={pathData(shape)} {...style} />;
    if (shape.kind === "ellipse") {
        return <ellipse cx={shape.x} cy={shape.y} rx={shape.width / 2} ry={shape.height / 2} {...style} />;
    }
    return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.radius} {...style} />;
}

export default function Illustration({ scene }: { scene: IllustrationScene }) {
    return (
        <svg className="dds-illustration" viewBox={`0 0 ${scene.width} ${scene.height}`} aria-hidden="true">
            {scene.layers.map((layer) => {
                const [x, y] = layer.motion?.position?.at(-1)?.value ?? [0, 0];
                const [scaleX, scaleY] = layer.motion?.scale?.at(-1)?.value ?? [1, 1];
                const [originX, originY] = layer.origin ?? [0, 0];
                const transform = [
                    `translate(${x + originX} ${y + originY})`,
                    `scale(${scaleX} ${scaleY})`,
                    `translate(${-originX} ${-originY})`,
                ].join(" ");
                return (
                    <g key={layer.name} transform={transform} opacity={layer.motion?.opacity?.at(-1)?.value ?? 1}>
                        {layer.shapes.map((shape, index) => <Shape key={index} shape={shape} />)}
                    </g>
                );
            })}
        </svg>
    );
}
