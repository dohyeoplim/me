import type { Project } from "../../_data/projects";

export default function ProjectVisual({ kind }: { kind: Project["visual"] }) {
    if (kind === "speech") {
        return (
            <div className="h-full" aria-hidden="true">
                <svg viewBox="0 0 480 320" className="h-full w-full" fill="none">
                    <g className="text-mark" stroke="currentColor" strokeWidth="2.5">
                        <path d="M54 240H426" />
                        <path d="m160 240 24 10 38-18 36 14 36-6" />
                    </g>
                    <g className="text-ink" stroke="currentColor" strokeWidth="3">
                        <rect x="58" y="101" width="100" height="138" rx="7" />
                        <path d="M91 239v-45h34v45M108 122v32M92 138h32M78 174h12M126 174h12" />
                        <path d="M294 158h86l34 26 6 34H294Z" />
                        <path d="M372 166h23l14 18h-37ZM318 170h36v48h-36Z" />
                        <circle cx="320" cy="220" r="14" />
                        <circle cx="392" cy="220" r="14" />
                    </g>
                    <g className="text-diagram" stroke="currentColor" strokeWidth="3.25">
                        <path d="M160 168h21l9-14 10 30 11-42 12 46 12-37 12 30 11-21 11 14 13-6h12" />
                        <path d="m286 160 8 8-8 8" />
                        <circle cx="386" cy="94" r="18" />
                        <circle cx="386" cy="94" r="4" />
                        <path d="m373 106 13 22 13-22" />
                    </g>
                </svg>
            </div>
        );
    }

    if (kind === "calls") {
        return (
            <div className="h-full" aria-hidden="true">
                <svg viewBox="0 0 480 320" className="h-full w-full" fill="none">
                    <g className="text-ink" stroke="currentColor" strokeWidth="3">
                        <rect x="58" y="68" width="120" height="184" rx="18" />
                        <path d="M101 88h34" />
                        <circle cx="118" cy="228" r="4" />
                        <path d="M82 160h10l6-12 7 28 8-39 9 44 9-38 9 31 8-21 8 13" />
                        <path d="M278 124h144M320 151h74M320 180h60M320 209h80" />
                        <circle cx="302" cy="151" r="4" />
                        <circle cx="302" cy="180" r="4" />
                        <circle cx="302" cy="209" r="4" />
                    </g>
                    <g className="text-mark" stroke="currentColor" strokeWidth="2.5">
                        <rect x="276" y="77" width="148" height="166" rx="12" />
                    </g>
                    <g className="text-diagram" stroke="currentColor" strokeWidth="3.25">
                        <path d="M178 160h16l8-12 8 26 9-32 10 35 10-26 9 18 10-9h12" />
                        <path d="m262 152 8 8-8 8" />
                        <circle cx="306" cy="100" r="17" />
                        <path d="M306 90v20M296 100h20" />
                    </g>
                </svg>
            </div>
        );
    }

    if (kind === "vision") {
        return (
            <div className="h-full" aria-hidden="true">
                <svg viewBox="0 0 480 320" className="h-full w-full" fill="none">
                    <g className="text-mark" stroke="currentColor" strokeWidth="2.5">
                        <path d="M58 58h364v190H58ZM58 216h364M58 248l54-32M422 248l-54-32" />
                    </g>
                    <g className="text-ink" stroke="currentColor" strokeWidth="3">
                        <rect x="125" y="125" width="64" height="56" rx="6" />
                        <path d="m112 183 10 16h70l10-16ZM130 199l-6 33M184 199l8 33M112 162v30M202 162v30" />
                        <path d="M322 190v-71" />
                        <path d="m322 145-30-19 6 32 24 12ZM322 132l29-21-5 34-24 13Z" />
                        <path d="m322 134-12-30 12-16 12 16Z" />
                        <path d="m292 190 10 42h40l10-42Z" />
                    </g>
                    <g className="text-diagram" stroke="currentColor" strokeWidth="3">
                        <rect x="94" y="92" width="132" height="152" rx="8" />
                        <rect x="260" y="84" width="120" height="160" rx="8" />
                        <path d="m201 105 6 6 12-14M353 97l6 6 12-14" />
                    </g>
                </svg>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col justify-center px-dds-xl" aria-hidden="true">
            <svg viewBox="0 0 300 150" className="mx-auto h-36 w-full">
                <g stroke="var(--border-subtle)" strokeWidth="2" fill="none">
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
                            strokeWidth="2"
                        />
                        <path
                            d={`M ${cx - 5} ${cy - 3} h 10 M ${cx - 5} ${cy + 3} h 7`}
                            stroke="var(--color-grey-300)"
                            strokeWidth="1.75"
                        />
                    </g>
                ))}
                <circle
                    cx="150"
                    cy="75"
                    r="16"
                    fill="var(--accent-soft)"
                    stroke="var(--accent)"
                    strokeWidth="2"
                />
                <circle cx="150" cy="75" r="4" fill="var(--accent)" />
            </svg>
            <p className="text-center font-support text-muted">Sections become connected context</p>
        </div>
    );
}
