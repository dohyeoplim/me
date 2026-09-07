"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { recognitionExample } from "../../_data/recognition";
import "./recognition.css";

const columnX = (column: number) => 28 + column * 80;
const rowY = (row: number) => 24 + row * 48;

export default function RecognitionDemo() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { amount: 0.5 });
    const reducedMotion = useReducedMotion();
    const animated = inView && !reducedMotion;

    return (
        <figure ref={ref} className="portfolio-decoder">
            <div className="portfolio-decoder-body">
                <div className="portfolio-decoder-legend font-support">
                    {recognitionExample.paths.map(({ name, constrained, legend }) => (
                        <span key={name} data-constrained={constrained}>{legend}</span>
                    ))}
                </div>
                <svg viewBox="0 0 456 144" className="portfolio-trellis" role="img"
                    aria-label={recognitionExample.description}>
                    {Array.from({ length: 5 }, (_, column) =>
                        Array.from({ length: 3 }, (_, row) =>
                            Array.from({ length: 3 }, (_, next) => (
                                <line key={[column, row, next].join("-")}
                                    x1={columnX(column)} y1={rowY(row)}
                                    x2={columnX(column + 1)} y2={rowY(next)}
                                    stroke="var(--border-subtle)" strokeWidth="1" />
                            )),
                        ),
                    )}
                    {recognitionExample.paths.map(({ name, constrained, rows }, index) => (
                        <motion.polyline key={name} className="portfolio-trellis-path"
                            points={rows.map((row, column) => `${columnX(column)},${rowY(row)}`).join(" ")}
                            fill="none" stroke={constrained ? "var(--diagram-accent)" : "var(--text-primary)"}
                            strokeWidth={constrained ? 3 : 2} strokeLinecap="round" strokeLinejoin="round"
                            initial={false}
                            animate={animated
                                ? { pathLength: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }
                                : { pathLength: 1, opacity: 1 }}
                            transition={animated
                                ? { duration: 4, times: [0, 0.25, 0.85, 1], delay: index * 0.15, repeat: Infinity }
                                : { duration: 0 }}
                        />
                    ))}
                    {Array.from({ length: 6 }, (_, column) =>
                        Array.from({ length: 3 }, (_, row) => {
                            const chosen = recognitionExample.paths.some((path) => path.rows[column] === row);
                            const constrained = recognitionExample.paths.some((path) =>
                                path.constrained && path.rows[column] === row);
                            return <circle key={`${column}-${row}`} cx={columnX(column)} cy={rowY(row)}
                                r={chosen ? 5 : 3} fill="var(--surface-panel)"
                                stroke={constrained ? "var(--diagram-accent)" : "var(--border-control)"}
                                strokeWidth={chosen ? 2 : 1} />;
                        }),
                    )}
                </svg>
            </div>
            <figcaption className="portfolio-decoder-comparison">
                {recognitionExample.paths.map(({ name, constrained, action, detail }) => (
                    <div key={name} data-constrained={constrained}>
                        <h4 className="font-body">{name}</h4>
                        <p className="font-support">{action}</p>
                        <p className="font-support text-muted">{detail}</p>
                    </div>
                ))}
            </figcaption>
        </figure>
    );
}
