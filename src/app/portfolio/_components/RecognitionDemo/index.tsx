"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import Badge from "@/app/components/DDS/Badge";
import { cn } from "@/app/lib/utils";

const unconstrained = [2, 1, 2, 0, 1, 2, 1];
const constrained = [2, 1, 1, 2, 1, 2, 1];
const x = (column: number) => 35 + column * 65;
const y = (row: number) => 30 + row * 48;

export default function RecognitionDemo() {
    const [enabled, setEnabled] = useState(true);
    const selected = enabled ? constrained : unconstrained;

    return (
        <figure className="ds-panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-grey-100 p-5 sm:px-8">
                <p className="ds-label">Inside the decoder</p>
                <div className="flex gap-1" role="group" aria-label="Compare decoding methods">
                    <Button
                        size="small"
                        variant={enabled ? "text" : "solid"}
                        aria-pressed={!enabled}
                        onClick={() => setEnabled(false)}
                    >
                        CTC
                    </Button>
                    <Button
                        size="small"
                        variant={enabled ? "solid" : "text"}
                        aria-pressed={enabled}
                        onClick={() => setEnabled(true)}
                    >
                        E-ACT
                    </Button>
                </div>
            </div>
            <div className="grid items-center gap-5 p-5 sm:p-8 md:grid-cols-[1fr_150px]">
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
                        <text x="35" y="198" fontSize="12" fill="var(--text-secondary)">
                            Recognition timesteps
                        </text>
                        <path
                            d="M 186 194 H 420 M 414 190 L 420 194 L 414 198"
                            fill="none"
                            stroke="var(--text-secondary)"
                        />
                    </svg>
                </div>
                <div className="flex flex-wrap gap-2 md:flex-col" aria-label="Decoding constraints">
                    {["Length", "Alphabet", "Checksum"].map((label) => (
                        <span
                            key={label}
                            className={cn(
                                "flex items-center gap-2 text-sm transition-colors",
                                enabled ? "text-[var(--accent)]" : "text-grey-400",
                            )}
                        >
                            <Check size={14} aria-hidden="true" className={enabled ? "opacity-100" : "opacity-20"} />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
            <figcaption className="flex flex-col gap-3 border-t border-grey-100 p-5 sm:px-8">
                <div className="flex flex-wrap items-center gap-3" aria-live="polite">
                    <Badge tone={enabled ? "accent" : "neutral"}>
                        {enabled ? "Best valid path" : "Highest-scoring path"}
                    </Badge>
                    <ArrowRight size={14} className="text-grey-400" aria-hidden="true" />
                    <span className="text-sm text-grey-600">
                        {enabled ? "Rules participate in decoding." : "Identifier rules are not enforced."}
                    </span>
                </div>
                <p className="text-xs leading-5 text-grey-500">Method illustration, not an experimental prediction.</p>
            </figcaption>
        </figure>
    );
}
