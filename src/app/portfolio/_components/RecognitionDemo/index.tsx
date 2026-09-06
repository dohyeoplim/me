"use client";

import { Check, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { recognitionExample } from "../../_data/recognition";

const columnX = (column: number) => 44 + column * 92;
const rowY = (row: number) => 28 + row * 57;

export default function RecognitionDemo() {
    const reducedMotion = useReducedMotion();

    return (
        <figure className="portfolio-decoder">
            <div className="portfolio-decoder-heading">
                <p className="font-body">{recognitionExample.title}</p>
            </div>
            <div className="portfolio-decoder-body">
                <svg
                    viewBox="0 0 460 174"
                    className="portfolio-trellis"
                    role="img"
                    aria-label="The same trellis with an invalid 827 path and a valid lower-posterior 820 path"
                >
                    {Array.from({ length: 4 }, (_, column) =>
                        Array.from({ length: 3 }, (_, row) =>
                            Array.from({ length: 3 }, (_, next) => Math.abs(row - next) > 1 ? null : (
                                <line
                                    key={[column, row, next].join("-")}
                                    x1={columnX(column)}
                                    y1={rowY(row)}
                                    x2={columnX(column + 1)}
                                    y2={rowY(next)}
                                    stroke="var(--border-subtle)"
                                    strokeWidth="1"
                                />
                            )),
                        ),
                    )}
                    {recognitionExample.candidates.map(({ code, valid, path }, index) => (
                        <motion.polyline
                            key={code}
                            className="portfolio-trellis-path"
                            points={path.map((row, column) => [columnX(column), rowY(row)].join(",")).join(" ")}
                            fill="none"
                            stroke={valid ? "var(--diagram-accent)" : "var(--text-secondary)"}
                            strokeWidth={valid ? 3 : 5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0.4 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.7 }}
                            transition={reducedMotion ? { duration: 0 } : {
                                duration: 0.85, delay: index * 0.2, ease: "easeOut",
                            }}
                        />
                    ))}
                    {Array.from({ length: 5 }, (_, column) =>
                        Array.from({ length: 3 }, (_, row) => {
                            const selected = recognitionExample.candidates.some(
                                (candidate) => candidate.path[column] === row,
                            );
                            const valid = recognitionExample.candidates.some(
                                (candidate) => candidate.valid && candidate.path[column] === row,
                            );
                            const stroke = valid ? "var(--diagram-accent)" : "var(--text-secondary)";
                            return (
                                <circle
                                    key={[column, row].join("-")}
                                    cx={columnX(column)}
                                    cy={rowY(row)}
                                    r={selected ? 6 : 4}
                                    fill="var(--surface-panel)"
                                    stroke={selected ? stroke : "var(--border-subtle)"}
                                    strokeWidth={selected ? 2 : 1}
                                />
                            );
                        }),
                    )}
                    {recognitionExample.candidates.map(({ code, valid, path }) => (
                        <text
                            key={code}
                            x={columnX(4) + 16}
                            y={rowY(path.at(-1) ?? 0) + 5}
                            className="font-body"
                            fill={valid ? "var(--diagram-accent)" : "var(--text-secondary)"}
                        >
                            {code.at(-1)}
                        </text>
                    ))}
                </svg>
                <div className="portfolio-decoder-readings">
                    {recognitionExample.candidates.slice().reverse().map(({ code, posterior, label, valid }) => {
                        const Status = valid ? Check : X;
                        return (
                            <div key={code} className="portfolio-decoder-reading" data-selected={valid}>
                                <div className="portfolio-decoder-value">
                                    <span className="font-body tabular-nums">{code}</span>
                                    <span className="font-support text-muted">p = {posterior}</span>
                                </div>
                                <p className="font-support"><Status size={16} aria-hidden="true" />{label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <figcaption className="portfolio-decoder-caption">
                <p className="font-body tabular-nums">{recognitionExample.rule}</p>
                <p>{recognitionExample.caption}</p>
            </figcaption>
        </figure>
    );
}
