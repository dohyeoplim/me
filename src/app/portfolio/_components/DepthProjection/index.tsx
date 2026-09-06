const blocks = [
    { x: 24, y: 58, width: 142, label: "Global features" },
    { x: 24, y: 176, width: 142, label: "Depth groups" },
    { x: 206, y: 58, width: 112, label: "Gate" },
    { x: 206, y: 176, width: 112, label: "Projection" },
];

export default function DepthProjection() {
    return (
        <svg viewBox="0 0 480 320" role="img" aria-label="Global features gate depth features before projection">
            <g fill="none" stroke="var(--diagram-accent)" strokeWidth="3" strokeLinejoin="round">
                <path d="M166 83H206 M262 108V176 M166 201H206 M318 201H376V142"
                    pathLength="1" className="dds-diagram-signal" />
                <path d="M95 58V30H376V102 M376 142V270H262" />
            </g>
            {blocks.map(({ x, y, width, label }) => (
                <g key={label}>
                    <rect x={x} y={y} width={width} height="50" rx="10" fill="var(--surface-panel)" />
                    <text x={x + width / 2} y={y + 30} textAnchor="middle"
                        className="font-support" fill="var(--text-primary)">{label}</text>
                </g>
            ))}
            <circle cx="376" cy="122" r="20" fill="var(--text-primary)" />
            <text x="242" y="24" textAnchor="middle" className="font-support" fill="var(--text-primary)">
                Global projection
            </text>
            <path d="M370 116L382 128M382 116L370 128" stroke="var(--surface-panel)" strokeWidth="3" />
            <text x="240" y="275" textAnchor="end" className="font-support" fill="var(--text-primary)">
                Classification
            </text>
        </svg>
    );
}

export function EmaTeacher() {
    return (
        <svg viewBox="0 0 480 100" role="img" aria-label="EMA updates teacher parameters from student parameters">
            <rect x="16" y="28" width="158" height="52" rx="10" fill="var(--surface-gallery)" />
            <rect x="306" y="28" width="158" height="52" rx="10" fill="var(--surface-gallery)" />
            <path d="M186 54H294L284 44M294 54L284 64" fill="none" stroke="var(--diagram-accent)"
                strokeWidth="3" pathLength="1" className="dds-diagram-signal" />
            <g className="font-support" textAnchor="middle" fill="var(--text-primary)">
                <text x="95" y="60">Student parameters</text>
                <text x="385" y="60">Teacher parameters</text>
                <text x="240" y="28">EMA</text>
            </g>
        </svg>
    );
}
