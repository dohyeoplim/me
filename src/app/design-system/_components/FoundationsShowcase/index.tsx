import SectionHeading from "@/app/components/DDS/SectionHeading";
import { colors, corners, spacing, typography } from "../../data";

export default function FoundationsShowcase() {
    return (
        <>
            <div className="dds-guide-group">
                <SectionHeading title="Color" variant="subsection" />
                <div className="dds-color-grid">
                    {colors.map(({ name, token, hex }) => (
                        <div key={token}>
                            <div
                                className="dds-color-swatch"
                                style={{ background: `var(${token})` }}
                                aria-hidden="true"
                            />
                            <p className="font-support">{name}</p>
                            <p className="font-support text-muted">{hex}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dds-guide-group">
                <SectionHeading title="Typography" variant="subsection" />
                <dl>
                    {typography.map(({ name, className, sample, size, weight, tracking, leading }) => (
                        <div key={name} className="dds-type-sample">
                            <dt className="font-support">
                                {name}
                                <div className="dds-type-spec">
                                    <p>Pretendard</p>
                                    <p>{size}, {weight}</p>
                                    <p>Letter spacing {tracking}</p>
                                    <p>Line height {leading}</p>
                                </div>
                            </dt>
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
                />
                <div className="dds-corner-grid">
                    {corners.map(({ name, value, radius }) => (
                        <div key={value}>
                            <div className="dds-corner-sample" data-corner={value} aria-hidden="true" />
                            <p className="font-support">{name}</p>
                            <p className="font-support text-muted">{radius}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
