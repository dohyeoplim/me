"use client";

import { Check, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";

const unconstrainedPath = [2, 1, 0, 1, 2];
const constrainedPath = [2, 1, 0, 1, 1];
const columnX = (column: number) => 26 + column * 56;
const rowY = (row: number) => 18 + row * 25;

type TrellisProps = {
    label: string;
    code: string;
    posterior: string;
    selected: number[];
    valid: boolean;
    delay: number;
    reducedMotion: boolean | null;
};

function Trellis({
    label,
    code,
    posterior,
    selected,
    valid,
    delay,
    reducedMotion,
}: TrellisProps) {
    const color = valid ? "var(--diagram-accent)" : "var(--text-secondary)";
    const StatusIcon = valid ? Check : X;

    return (
        <div className="grid gap-dds-xs rounded-dds border border-line bg-surface p-dds-sm">
            <div className="flex flex-wrap items-center justify-between gap-dds-xs">
                <div className="flex flex-wrap items-center gap-dds-sm">
                    <p className="font-body03-regular">{label}</p>
                    <span
                        className={
                            valid
                                ? "flex items-center gap-dds-xs font-caption03-regular text-diagram"
                                : "flex items-center gap-dds-xs font-caption03-regular text-muted"
                        }
                    >
                        <StatusIcon size={14} aria-hidden="true" />
                        {valid ? "Selected, lower posterior" : "Higher posterior, invalid"}
                    </span>
                </div>
                <p className="font-caption03-regular tabular-nums text-muted">
                    {code}, p = {posterior}
                </p>
            </div>
            <svg
                viewBox="0 0 248 78"
                className="w-full"
                role="img"
                aria-label={
                    valid
                        ? [code, "a valid lower-posterior path"].join(", ")
                        : [code, "the invalid top path"].join(", ")
                }
            >
                {Array.from({ length: 4 }, (_, column) =>
                    Array.from({ length: 3 }, (_, row) =>
                        Array.from({ length: 3 }, (_, next) => {
                            if (Math.abs(row - next) > 1) return null;

                            return (
                                <line
                                    key={[column, row, next].join("-")}
                                    x1={columnX(column)}
                                    y1={rowY(row)}
                                    x2={columnX(column + 1)}
                                    y2={rowY(next)}
                                    stroke="var(--border-subtle)"
                                    strokeWidth="0.8"
                                    opacity="0.7"
                                />
                            );
                        }),
                    ),
                )}
                <motion.polyline
                    className="portfolio-trellis-path"
                    points={selected
                        .map((row, column) => [columnX(column), rowY(row)].join(","))
                        .join(" ")}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0.4 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay, ease: "easeOut" }}
                />
                {Array.from({ length: 5 }, (_, column) =>
                    Array.from({ length: 3 }, (_, row) => {
                        const active = selected[column] === row;

                        return (
                            <circle
                                key={[column, row].join("-")}
                                cx={columnX(column)}
                                cy={rowY(row)}
                                r={active ? 4.5 : 3.5}
                                fill={active ? color : "var(--surface-panel)"}
                                stroke={active ? color : "var(--border-subtle)"}
                                strokeWidth="1"
                            />
                        );
                    }),
                )}
            </svg>
        </div>
    );
}

export default function RecognitionDemo() {
    const reducedMotion = useReducedMotion();

    return (
        <figure className="portfolio-decoder">
            <div className="portfolio-decoder-heading">
                <div>
                    <p className="font-support">Inside the decoder</p>
                    <p className="font-caption03-regular text-muted">Same trellis, different selection rule</p>
                </div>
            </div>
            <div className="portfolio-decoder-body">
                <div
                    className="grid gap-dds-sm"
                    role="group"
                    aria-label="Comparison of CTC and E-ACT decoding"
                >
                    <Trellis
                        label="Unconstrained CTC"
                        code="827"
                        posterior="0.84"
                        selected={unconstrainedPath}
                        valid={false}
                        delay={0.1}
                        reducedMotion={reducedMotion}
                    />
                    <Trellis
                        label="Arithmetic-constrained"
                        code="820"
                        posterior="0.72"
                        selected={constrainedPath}
                        valid
                        delay={0.3}
                        reducedMotion={reducedMotion}
                    />
                </div>
                <div className="grid content-center gap-dds-sm font-support">
                    <div>
                        <p className="text-muted">Checksum rule</p>
                        <p className="font-body03-regular tabular-nums">check = (8 + 2) mod 10</p>
                    </div>
                    <p className="flex items-center gap-dds-xs text-diagram">
                        <Check size={14} aria-hidden="true" />
                        0 required
                    </p>
                    <p className="flex items-center gap-dds-xs text-muted">
                        <X size={14} aria-hidden="true" />
                        7 rejected
                    </p>
                </div>
            </div>
            <figcaption className="portfolio-decoder-caption">
                Illustrative example. E-ACT selects the valid 0.72 path over the invalid 0.84 path.
            </figcaption>
        </figure>
    );
}
