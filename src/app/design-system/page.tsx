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
    title: `${designSystem.name} · ${designSystem.fullName}`,
    description: designSystem.description,
};

export default function DesignSystemPage() {
    return (
        <SlideTransition>
            <main id="main-content" className="mx-auto w-full max-w-4xl px-6 pb-24 pt-32 md:pt-44">
                <header className="pb-16">
                    <p className="ds-label mb-8">{designSystem.fullName}</p>
                    <h1 className="font-display-light mb-6">{designSystem.name}</h1>
                    <p className="font-body01-light max-w-lg text-grey-500">{designSystem.description}</p>
                    <nav
                        aria-label="Design system sections"
                        className="mt-10 flex flex-wrap gap-6 text-sm text-grey-600"
                    >
                        {[
                            { id: "foundations", label: "Foundations" },
                            { id: "buttons", label: "Buttons" },
                            { id: "components", label: "Components" },
                            { id: "motion", label: "Motion" },
                        ].map(({ id, label }) => (
                            <a key={id} href={`#${id}`} className="flex items-center gap-2 py-2 hover:text-grey-900">
                                {label} <ArrowRight size={14} aria-hidden="true" />
                            </a>
                        ))}
                    </nav>
                </header>
                <section id="foundations" className="ds-section border-t border-grey-200">
                    <SectionHeading
                        number="01"
                        title="Foundations"
                        description="Neutral surfaces, readable type, and color with a specific purpose."
                    />
                    <h3 className="font-head01-medium mb-6">Color</h3>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {colors.map(({ name, token, value }) => (
                            <div key={token}>
                                <div
                                    className="mb-3 h-20 rounded-lg border border-grey-200"
                                    style={{ background: `var(${token})` }}
                                />
                                <p className="mb-1 text-sm">{name}</p>
                                <p className="text-xs text-grey-500">{value}</p>
                                <code className="mt-2 block break-all text-xs text-grey-500">{token}</code>
                            </div>
                        ))}
                    </div>
                    <h3 className="font-head01-medium mb-3 mt-16">Typography</h3>
                    <p className="ds-label mb-8">Pretendard · Sentence case · Natural spacing</p>
                    <div className="divide-y divide-grey-200">
                        {typography.map(({ name, className, sample, detail }) => (
                            <div key={name} className="grid gap-5 py-7 sm:grid-cols-[140px_1fr]">
                                <div>
                                    <p className="mb-1 text-sm">{name}</p>
                                    <p className="ds-label">{detail}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className={className}>{sample}</p>
                                    <code className="mt-3 block text-xs text-grey-500">{className}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h3 className="font-head01-medium mb-7 mt-12">Spacing</h3>
                    <div className="flex flex-wrap items-end gap-7">
                        {spacing.map((space) => (
                            <div key={space} className="flex min-w-10 flex-col items-center gap-3">
                                <div style={{ height: space, width: 24 }} className="rounded-sm bg-grey-200" />
                                <span className="ds-label">{space}</span>
                            </div>
                        ))}
                    </div>
                </section>
                <section id="buttons" className="ds-section border-t border-grey-200">
                    <SectionHeading
                        number="02"
                        title="Buttons"
                        description="Three sizes, three treatments, and states that make every interaction clear."
                    />
                    <ButtonShowcase />
                </section>
                <section id="components" className="ds-section border-t border-grey-200">
                    <SectionHeading
                        number="03"
                        title="Components"
                        description="The same components used throughout the portfolio."
                    />
                    <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                            <h3 className="font-head01-medium mb-5">Badges</h3>
                            <Surface className="flex min-h-36 flex-wrap items-center gap-3 p-6">
                                <Badge>Research</Badge>
                                <Badge tone="accent">Under review</Badge>
                                <Badge tone="success">Complete</Badge>
                            </Surface>
                        </div>
                        <div>
                            <h3 className="font-head01-medium mb-5">Links</h3>
                            <Surface className="flex min-h-36 flex-col items-start justify-center gap-5 p-6">
                                <LinkButton href="/portfolio" label="View portfolio" />
                                <LinkButton href="https://github.com/dohyeoplim" label="GitHub" icon="external" />
                            </Surface>
                        </div>
                        <div>
                            <h3 className="font-head01-medium mb-5">Metrics</h3>
                            <Surface className="p-6">
                                <Metric
                                    value="~8,000"
                                    label="Images annotated"
                                    detail="Industrial OCR evaluation data"
                                />
                            </Surface>
                        </div>
                        <div>
                            <h3 className="font-head01-medium mb-5">Surfaces</h3>
                            <Surface className="flex min-h-48 flex-col justify-center gap-3 p-6">
                                <p className="font-body02-regular">A place for related information.</p>
                                <p className="ds-label">White fill · 1px border · 16px radius</p>
                                <code className="text-xs text-grey-500">Surface</code>
                            </Surface>
                        </div>
                    </div>
                </section>
                <section id="motion" className="ds-section border-t border-grey-200">
                    <SectionHeading
                        number="04"
                        title="Motion"
                        description={
                            "A small reveal as content enters the viewport. Once, without taking over the scroll."
                        }
                    />
                    <Reveal>
                        <Surface className="flex flex-wrap items-center justify-between gap-6 p-8">
                            <div>
                                <p className="font-body01-light mb-2">Room to arrive.</p>
                                <p className="ds-label">650ms · 24px travel · Reduced motion supported</p>
                            </div>
                            <ArrowUpRight size={32} strokeWidth={1} className="text-grey-400" aria-hidden="true" />
                        </Surface>
                    </Reveal>
                </section>
            </main>
        </SlideTransition>
    );
}
