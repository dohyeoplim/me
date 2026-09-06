const blocks = [
    { x: 24, y: 42, width: 142, label: "Global features" },
    { x: 24, y: 124, width: 142, label: "Depth groups" },
    { x: 206, y: 42, width: 112, label: "Gate" },
    { x: 206, y: 124, width: 112, label: "Projection" },
];

export default function DepthProjection() {
    return (
        <svg viewBox="0 0 480 200" role="img" aria-label="Global features gate depth features before projection">
            <g fill="none" stroke="var(--diagram-accent)" strokeWidth="3" strokeLinejoin="round">
                <path d="M166 64H206 M262 86V124 M166 146H206 M318 146H396V120"
                    pathLength="1" className="dds-diagram-signal" />
                <path d="M95 42V18H396V80" />
            </g>
            {blocks.map(({ x, y, width, label }) => (
                <g key={label}>
                    <rect x={x} y={y} width={width} height="44" rx="10" fill="var(--surface-panel)" />
                    <text x={x + width / 2} y={y + 27} textAnchor="middle"
                        className="font-support" fill="var(--text-primary)">{label}</text>
                </g>
            ))}
            <circle cx="396" cy="100" r="20" fill="var(--text-primary)" />
            <text x="312" y="37" textAnchor="middle" className="font-support" fill="var(--text-primary)">
                Global projection
            </text>
            <path d="M390 94L402 106M402 94L390 106" stroke="var(--surface-panel)" strokeWidth="3" />
            <text x="396" y="172" textAnchor="middle" className="font-support" fill="var(--text-primary)">
                Fusion
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
