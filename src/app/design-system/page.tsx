import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SlideTransition from "@/app/components/SlideTransition";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Surface from "@/app/components/DDS/Surface";
import Badge from "@/app/components/DDS/Badge";
import Metric from "@/app/components/DDS/Metric";
import Reveal from "@/app/components/DDS/Reveal";
import LinkButton from "@/app/components/LinkButton";
import ButtonShowcase from "./_components/ButtonShowcase";
import { colors, designSystem, spacing, typography } from "./data";

export const metadata: Metadata = {
    title: `${designSystem.name}, ${designSystem.fullName}`,
    description: designSystem.description,
};

export default function DesignSystemPage() {
    return (
        <SlideTransition>
            <main
                id="main-content"
                className="mx-auto w-full max-w-4xl px-dds-lg pb-dds-4xl pt-dds-5xl md:pt-dds-page-top"
            >
                <header className="pb-dds-3xl">
                    <h1 className="font-display-light mb-dds-lg">{designSystem.name}</h1>
                    <p className="font-body01-regular mb-dds-lg">{designSystem.fullName}</p>
                    <p className="font-body01-light max-w-lg text-muted">{designSystem.description}</p>
                    <nav
                        aria-label="Design system sections"
                        className="mt-dds-2xl flex flex-wrap gap-dds-lg font-body03-regular text-muted"
                    >
                        {[
                            { id: "foundations", label: "Foundations" },
                            { id: "buttons", label: "Buttons" },
                            { id: "components", label: "Components" },
                            { id: "motion", label: "Motion" },
                        ].map(({ id, label }) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                className="flex items-center gap-dds-xs py-dds-xs hover:text-ink"
                            >
                                {label} <ArrowRight size={14} aria-hidden="true" />
                            </a>
                        ))}
                    </nav>
                </header>
                <section id="foundations" className="ds-section border-t border-line">
                    <SectionHeading
                        title="Foundations"
                        description="Neutral surfaces, readable type, and color with a specific purpose."
                    />
                    <h3 className="font-head01-medium mb-dds-lg">Color</h3>
                    <div className="grid grid-cols-2 gap-dds-lg sm:grid-cols-4">
                        {colors.map(({ name, token, value }) => (
                            <div key={token}>
                                <div
                                    className="mb-dds-sm h-20 rounded-dds border border-line"
                                    style={{ background: `var(${token})` }}
                                />
                                <p className="mb-dds-2xs font-body03-regular">{name}</p>
                                <p className="font-body03-light text-muted">{value}</p>
                                <code className="mt-dds-xs block break-all font-body03-light text-muted">{token}</code>
                            </div>
                        ))}
                    </div>
                    <h3 className="font-head01-medium mb-dds-sm mt-dds-3xl">Typography</h3>
                    <p className="ds-label mb-dds-xl">Pretendard, Sentence case, Natural spacing</p>
                    <div className="divide-y divide-line">
                        {typography.map(({ name, className, sample, detail }) => (
                            <div key={name} className="grid gap-dds-lg py-dds-xl sm:grid-cols-[140px_1fr]">
                                <div>
                                    <p className="mb-dds-2xs font-body03-regular">{name}</p>
                                    <p className="ds-label">{detail}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className={className}>{sample}</p>
                                    <code className="mt-dds-sm block font-body03-light text-muted">{className}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h3 className="font-head01-medium mb-dds-xl mt-dds-2xl">Spacing</h3>
                    <p className="font-body02-light mb-dds-xl text-muted">
                        Use the same scale for margins, padding, and gaps. Section spacing adapts from 80 to 128px with
                        the viewport.
                    </p>
                    <dl className="divide-y divide-line">
                        {spacing.map(({ name, value, usage }) => (
                            <div key={name} className="grid grid-cols-[1fr_1fr] items-center gap-dds-md py-dds-md">
                                <dt className="font-body03-regular">
                                    {name}, {value}px
                                </dt>
                                <dd className="font-body03-light text-muted">
                                    <div
                                        style={{ width: `var(--spacing-dds-${name})` }}
                                        className="mb-dds-xs h-dds-xs bg-line"
                                    />
                                    {usage}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className="font-body03-light mt-dds-lg text-muted">
                        <code>gap-dds-md</code>, <code>px-dds-lg</code>, <code>mb-dds-2xl</code>
                    </p>
                </section>
                <section id="buttons" className="ds-section border-t border-line">
                    <SectionHeading
                        title="Buttons"
                        description="Three sizes, three treatments, and states that make every interaction clear."
                    />
                    <ButtonShowcase />
                </section>
                <section id="components" className="ds-section border-t border-line">
                    <SectionHeading
                        title="Components"
                        description="The same components used throughout the portfolio."
                    />
                    <div className="grid gap-dds-xl sm:grid-cols-2">
                        <div>
                            <h3 className="font-head01-medium mb-dds-lg">Status text</h3>
                            <Surface className="flex min-h-36 flex-wrap items-center gap-dds-sm p-dds-lg">
                                <Badge>Research</Badge>
                                <Badge tone="accent">Under review</Badge>
                                <Badge tone="success">Complete</Badge>
                            </Surface>
                        </div>
                        <div>
                            <h3 className="font-head01-medium mb-dds-lg">Links</h3>
                            <Surface className="flex min-h-36 flex-col items-start justify-center gap-dds-lg p-dds-lg">
                                <LinkButton href="/portfolio" label="View portfolio" />
                                <LinkButton href="https://github.com/dohyeoplim" label="GitHub" icon="external" />
                            </Surface>
                        </div>
                        <div>
                            <h3 className="font-head01-medium mb-dds-lg">Metrics</h3>
                            <Surface className="p-dds-lg">
                                <Metric
                                    value="~8,000"
                                    label="Images annotated"
                                    detail="Industrial OCR evaluation data"
                                />
                            </Surface>
                        </div>
                        <div>
                            <h3 className="font-head01-medium mb-dds-lg">Surfaces</h3>
                            <Surface className="flex min-h-48 flex-col justify-center gap-dds-sm p-dds-lg">
                                <p className="font-body02-regular">A place for related information.</p>
                                <p className="ds-label">White fill, 1px border, 8px radius</p>
                                <code className="font-body03-light text-muted">Surface</code>
                            </Surface>
                        </div>
                    </div>
                </section>
                <section id="motion" className="ds-section border-t border-line">
                    <SectionHeading
                        title="Motion"
                        description={
                            "A small reveal as content enters the viewport. Once, without taking over the scroll."
                        }
                    />
                    <Reveal>
                        <Surface className="flex flex-wrap items-center justify-between gap-dds-lg p-dds-xl">
                            <div>
                                <p className="font-body01-light mb-dds-xs">Room to arrive.</p>
                                <p className="font-body03-light text-muted">
                                    480ms with 12px travel. Reduced motion supported.
                                </p>
                            </div>
                            <ArrowUpRight size={32} strokeWidth={1} className="text-faint" aria-hidden="true" />
                        </Surface>
                    </Reveal>
                </section>
            </main>
        </SlideTransition>
    );
}
