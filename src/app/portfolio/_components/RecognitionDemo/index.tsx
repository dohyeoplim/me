"use client";

import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { recognitionExample } from "../../_data/recognition";

const columnX = (column: number) => 28 + column * 80;
const rowY = (row: number) => 24 + row * 48;

export default function RecognitionDemo() {
    const reducedMotion = useReducedMotion();

    return (
        <figure className="portfolio-decoder">
            <div className="portfolio-decoder-body">
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
                            fill="none" stroke={constrained ? "var(--diagram-accent)" : "var(--text-secondary)"}
                            strokeWidth={constrained ? 3 : 2} strokeLinecap="round" strokeLinejoin="round"
                            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : index * 0.15 }}
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
