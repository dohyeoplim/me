"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/app/lib/utils";

const unconstrained = [2, 1, 2, 0, 1, 2, 1];
const constrained = [2, 1, 1, 2, 1, 2, 1];
const x = (column: number) => 35 + column * 65;
const y = (row: number) => 30 + row * 48;

export default function RecognitionDemo() {
    const [enabled, setEnabled] = useState(true);
    const selected = enabled ? constrained : unconstrained;

    return (
        <figure className="portfolio-decoder">
            <div className={cn(
                "flex flex-wrap items-center justify-between gap-dds-md",
                "border-b border-line p-dds-lg sm:px-dds-xl",
            )}>
                <p className="font-body03-regular">Inside the decoder</p>
                <div className="flex gap-dds-2xs" role="group" aria-label="Compare decoding methods">
                    <button
                        type="button"
                        className="dds-choice"
                        aria-pressed={!enabled}
                        onClick={() => setEnabled(false)}
                    >
                        CTC
                    </button>
                    <button
                        type="button"
                        className="dds-choice"
                        aria-pressed={enabled}
                        onClick={() => setEnabled(true)}
                    >
                        E-ACT
                    </button>
                </div>
            </div>
            <div className="grid items-center gap-dds-lg p-dds-lg sm:p-dds-xl md:grid-cols-[1fr_150px]">
                <div>
                    <svg
                        viewBox="0 0 460 205"
                        className="w-full"
                        role="img"
                        aria-label={
                            enabled
                                ? "A path through the CTC trellis selected with identifier constraints."
                                : "A path through the CTC trellis selected without identifier constraints."
                        }
                    >
                        {Array.from({ length: 6 }, (_, column) =>
                            Array.from({ length: 4 }, (_, row) =>
                                Array.from({ length: 4 }, (_, next) => (
                                    <line
                                        key={`${column}-${row}-${next}`}
                                        x1={x(column)}
                                        y1={y(row)}
                                        x2={x(column + 1)}
                                        y2={y(next)}
                                        stroke="var(--border-subtle)"
                                        strokeWidth="0.7"
                                        opacity="0.55"
                                    />
                                )),
                            ),
                        )}
                        <polyline
                            points={selected.map((row, column) => `${x(column)},${y(row)}`).join(" ")}
                            fill="none"
                            stroke={enabled ? "var(--accent)" : "var(--text-secondary)"}
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                        {Array.from({ length: 7 }, (_, column) =>
                            Array.from({ length: 4 }, (_, row) => (
                                <circle
                                    key={`${column}-${row}`}
                                    cx={x(column)}
                                    cy={y(row)}
                                    r="5"
                                    fill={
                                        selected[column] === row
                                            ? enabled
                                                ? "var(--accent)"
                                                : "var(--text-secondary)"
                                            : "var(--surface-panel)"
                                    }
                                    stroke={selected[column] === row ? "transparent" : "var(--border-subtle)"}
                                />
                            )),
                        )}
                        <path
                            d="M 186 194 H 420 M 414 190 L 420 194 L 414 198"
                            fill="none"
                            stroke="var(--text-secondary)"
                        />
                    </svg>
                </div>
                <div className="flex flex-wrap gap-dds-xs md:flex-col" aria-label="Decoding constraints">
                    {["Length", "Alphabet", "Checksum"].map((label) => (
                        <span
                            key={label}
                            className={cn(
                                "flex items-center gap-dds-xs font-body03-regular transition-colors",
                                enabled ? "text-action" : "text-faint",
                            )}
                        >
                            <Check size={14} aria-hidden="true" className={enabled ? "opacity-100" : "opacity-20"} />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
            <figcaption className="font-body02-light text-muted px-dds-lg" aria-live="polite">
                {enabled
                    ? "Length, alphabet, and checksum rules guide the selection."
                    : "Without identifier constraints, the highest-scoring path can still be invalid."}
                <span className="sr-only">Method illustration, not an experimental prediction.</span>
            </figcaption>
        </figure>
    );
}
