import { ArrowDown, ArrowRight } from "lucide-react";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Metric from "@/app/components/DDS/Metric";
import Reveal from "@/app/components/DDS/Reveal";
import Badge from "@/app/components/DDS/Badge";
import Surface from "@/app/components/DDS/Surface";
import RecognitionDemo from "../RecognitionDemo";
import { research } from "../../_data/research";

const { eact, industrial, kraftbox } = research;

export default function Research() {
    return (
        <section id="research" className="ds-section">
            <SectionHeading number="01" title={research.title} description={research.description} />
            <Reveal>
                <article className="mb-20">
                    <div className="mb-7 flex flex-wrap items-center gap-3">
                        <h3 className="font-title02-light mr-auto">{eact.name}</h3>
                        <Badge>{eact.role}</Badge>
                        <Badge tone="accent">{eact.status}</Badge>
                    </div>
                    <p className="mb-4 max-w-2xl text-2xl font-light leading-snug tracking-tight sm:text-3xl">
                        {eact.headline}
                    </p>
                    <p className="font-body02-light mb-8 max-w-2xl text-grey-600">{eact.description}</p>
                    <RecognitionDemo />
                    <div className="my-9 grid gap-8 sm:grid-cols-2">
                        {eact.metrics.map((metric) => (
                            <Metric key={metric.label} {...metric} />
                        ))}
                    </div>
                    <details className="group border-y border-grey-200 py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
                            {eact.detailsLabel}
                            <ArrowDown size={16} className="transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="font-body02-light mt-6 grid gap-6 text-grey-600 sm:grid-cols-2">
                            <p>{eact.contributions}</p>
                            <div>
                                <p className="mb-2 text-grey-900">{eact.paper}</p>
                                <p className="ds-label">{eact.authors}</p>
                                <p className="ds-label mt-2">{eact.submission}</p>
                            </div>
                        </div>
                    </details>
                </article>
            </Reveal>
            <div className="grid gap-12 md:grid-cols-2">
                <Reveal>
                    <article>
                        <Surface className="mb-7 overflow-hidden p-6">
                            <div className="mb-5 flex items-baseline justify-between gap-3">
                                <span className="font-metric-light">{industrial.count}</span>
                                <span className="ds-label">{industrial.countLabel}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-1.5" aria-hidden="true">
                                {Array.from({ length: 72 }, (_, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square rounded-[2px]"
                                        style={{
                                            background: index % 13 === 0 ? "var(--accent)" : "var(--surface-muted)",
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="ds-label mt-5 flex flex-wrap items-center gap-2">
                                {industrial.steps.map((step, index) => (
                                    <span key={step} className="flex items-center gap-2">
                                        {index > 0 && <ArrowRight size={12} aria-hidden="true" />}
                                        {step}
                                    </span>
                                ))}
                            </div>
                        </Surface>
                        <p className="ds-label mb-2">{industrial.context}</p>
                        <h3 className="font-head01-medium mb-3">{industrial.name}</h3>
                        <p className="font-body02-light text-grey-600">{industrial.description}</p>
                        <p className="font-body02-light mt-5 border-l border-grey-200 pl-4 text-grey-800">
                            {industrial.insight}
                        </p>
                    </article>
                </Reveal>
                <Reveal>
                    <article>
                        <Surface className="mb-7 flex min-h-64 flex-col justify-between gap-5 p-6">
                            <div className="flex items-center justify-between">
                                <span className="ds-label">{kraftbox.diagram.label}</span>
                                <Badge tone="accent">{kraftbox.diagram.identifier}</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {kraftbox.diagram.forms.map((label) => (
                                    <div key={label} className="rounded border border-grey-200 p-3">
                                        <p className="mb-3 text-xs text-grey-600">{label}</p>
                                        <div className="space-y-2" aria-hidden="true">
                                            <div className="h-1 w-3/4 bg-grey-200" />
                                            <div className="h-1 w-full bg-grey-100" />
                                            <div className="h-4 w-full rounded-sm bg-[var(--accent-soft)]" />
                                            <div className="h-1 w-2/3 bg-grey-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs leading-5 text-grey-500">{kraftbox.diagram.caption}</p>
                        </Surface>
                        <p className="ds-label mb-2">{kraftbox.context}</p>
                        <h3 className="font-head01-medium mb-3">{kraftbox.name}</h3>
                        <p className="font-body02-light text-grey-600">{kraftbox.description}</p>
                        <p className="font-body02-light mt-5 border-l border-grey-200 pl-4 text-grey-800">
                            {kraftbox.insight}
                        </p>
                    </article>
                </Reveal>
            </div>
        </section>
    );
}
