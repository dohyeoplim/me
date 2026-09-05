import { ArrowRight, AudioLines, FileText, ScanLine } from "lucide-react";
import type { Project } from "../../_data/projects";
import { cn } from "@/app/lib/utils";

const wave = [12, 20, 14, 32, 44, 25, 51, 64, 38, 22, 48, 58, 30, 44, 21, 12, 26, 42, 18, 10];

export default function ProjectVisual({ kind }: { kind: Project["visual"] }) {
    if (kind === "speech") {
        return (
            <div className="flex h-full flex-col justify-center gap-7 px-8" aria-hidden="true">
                <div className="flex h-16 items-center justify-center gap-1.5">
                    {wave.map((height, index) => (
                        <span key={index} className="w-1.5 rounded-full bg-grey-400" style={{ height }} />
                    ))}
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-grey-500">
                    <AudioLines size={17} /> Call <ArrowRight size={14} /> ASR
                    <ArrowRight size={14} /> <FileText size={17} /> Trip
                </div>
            </div>
        );
    }

    if (kind === "calls") {
        return (
            <div className="flex h-full flex-col justify-center px-8" aria-hidden="true">
                <div className="grid grid-cols-3 gap-3">
                    {["Call 01", "Call 02", "Call 03"].map((label, index) => (
                        <div key={label} className="rounded-lg border border-grey-200 bg-white p-3">
                            <AudioLines size={19} strokeWidth={1.3} className="mb-5 text-grey-400" />
                            <p className="mb-3 text-xs text-grey-500">{label}</p>
                            <div className="h-1 rounded bg-grey-100">
                                <div className="h-1 rounded bg-grey-300" style={{ width: `${45 + index * 20}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mx-auto h-5 w-px bg-grey-200" />
                <p className="text-center text-sm text-grey-500">Context for the next conversation</p>
            </div>
        );
    }

    if (kind === "vision") {
        return (
            <div className="flex h-full flex-col justify-center gap-5 px-8" aria-hidden="true">
                <div className="flex items-center justify-center gap-5">
                    {["Before", "After"].map((label, index) => (
                        <div key={label} className="flex-1">
                            <div
                                className={cn(
                                    "relative flex h-24 items-center justify-center",
                                    "rounded-lg border border-grey-200",
                                )}
                            >
                                <ScanLine size={48} strokeWidth={0.6} className="text-grey-300" />
                                <span className="absolute bottom-4 left-4 h-5 w-7 rounded-sm border border-grey-400" />
                                {index === 1 && (
                                    <span
                                        className={cn(
                                            "absolute right-4 top-4 h-6 w-8 rounded-sm",
                                            "border border-[var(--accent)]",
                                        )}
                                    />
                                )}
                            </div>
                            <p className="mt-2 text-center text-xs text-grey-500">{label}</p>
                        </div>
                    ))}
                </div>
                <p className="text-center text-sm text-grey-500">Visual comparison · On device</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col justify-center px-8" aria-hidden="true">
            <svg viewBox="0 0 300 150" className="mx-auto h-36 w-full">
                <g stroke="var(--border-subtle)" fill="none">
                    <path d="M 45 40 L 150 75 L 250 30 M 45 115 L 150 75 L 250 120 M 150 75 L 150 15" />
                    <path d="M 45 40 L 45 115 M 250 30 L 250 120" strokeDasharray="3 4" />
                </g>
                {[
                    [45, 40],
                    [45, 115],
                    [250, 30],
                    [250, 120],
                    [150, 15],
                ].map(([cx, cy]) => (
                    <g key={`${cx}-${cy}`}>
                        <rect
                            x={cx - 12}
                            y={cy - 12}
                            width="24"
                            height="24"
                            rx="4"
                            fill="white"
                            stroke="var(--border-subtle)"
                        />
                        <path
                            d={`M ${cx - 5} ${cy - 3} h 10 M ${cx - 5} ${cy + 3} h 7`}
                            stroke="var(--color-grey-300)"
                        />
                    </g>
                ))}
                <circle cx="150" cy="75" r="16" fill="var(--accent-soft)" stroke="var(--accent)" />
                <circle cx="150" cy="75" r="4" fill="var(--accent)" />
            </svg>
            <p className="text-center text-sm text-grey-500">Sections become connected context</p>
        </div>
    );
}
