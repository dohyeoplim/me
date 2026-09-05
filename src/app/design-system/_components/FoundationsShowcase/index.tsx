import SectionHeading from "@/app/components/DDS/SectionHeading";
import { colors, corners, spacing, typography } from "../../data";

export default function FoundationsShowcase() {
    return (
        <>
            <div className="dds-guide-group">
                <SectionHeading title="Color" variant="subsection" />
                <div className="dds-color-grid">
                    {colors.map(({ name, token }) => (
                        <div key={token}>
                            <div
                                className="dds-color-swatch"
                                style={{ background: `var(${token})` }}
                                aria-hidden="true"
                            />
                            <p className="font-support">{name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dds-guide-group">
                <SectionHeading title="Typography" variant="subsection" description="Pretendard, regular and medium." />
                <dl>
                    {typography.map(({ name, className, sample }) => (
                        <div key={name} className="dds-type-sample">
                            <dt className="font-support text-muted">{name}</dt>
                            <dd className={className}>{sample}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <div className="dds-guide-group">
                <SectionHeading title="Spacing" variant="subsection" />
                <dl>
                    {spacing.map(({ name, token, value }) => (
                        <div key={token} className="dds-spacing-sample">
                            <dt className="font-support">{name}</dt>
                            <dd className="dds-example-actions font-support">
                                <div
                                    className="dds-spacing-bar"
                                    style={{ width: `var(--spacing-dds-${token})` }}
                                    aria-hidden="true"
                                />
                                {value}px
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
            <div className="dds-guide-group">
                <SectionHeading
                    title="Corners"
                    variant="subsection"
                    description="Squircle corners with a rounded fallback. Pills are reserved for compact choices."
                />
                <div className="dds-corner-grid">
                    {corners.map(({ name, value }) => (
                        <div key={value}>
                            <div className="dds-corner-sample" data-corner={value} aria-hidden="true" />
                            <p className="font-support">{name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
