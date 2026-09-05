import { ArrowDown } from "lucide-react";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Metric from "@/app/components/DDS/Metric";
import Reveal from "@/app/components/DDS/Reveal";
import RecognitionDemo from "../RecognitionDemo";
import { research } from "../../_data/research";

const { eact, industrial, kraftbox } = research;

export default function Research() {
    return (
        <section id="research" className="ds-section">
            <SectionHeading title={research.title} />
            <Reveal>
                <article>
                    <header className="portfolio-work-heading">
                        <h3 className="font-title02-light">{eact.name}</h3>
                        <p className="font-body03-light text-muted">
                            {eact.role}, {eact.status}
                        </p>
                    </header>
                    <p className="font-feature-light mb-dds-lg max-w-2xl">{eact.headline}</p>
                    <p className="font-body02-light mb-dds-xl max-w-2xl text-muted">{eact.description}</p>
                    <RecognitionDemo />
                    <div className="portfolio-results">
                        {eact.metrics.map((metric) => (
                            <Metric key={metric.label} {...metric} />
                        ))}
                    </div>
                    <details className="group border-y border-line py-dds-lg">
                        <summary className="font-body03-regular flex cursor-pointer list-none justify-between">
                            {eact.detailsLabel}
                            <ArrowDown size={16} className="transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="font-body02-light mt-dds-lg grid gap-dds-xl text-muted sm:grid-cols-2">
                            <p>{eact.contributions}</p>
                            <div>
                                <p className="mb-dds-md text-ink">{eact.paper}</p>
                                <p>{eact.authors}</p>
                            </div>
                        </div>
                    </details>
                </article>
            </Reveal>
            <Reveal className="portfolio-research-note">
                <article>
                    <h3 className="font-feature-light mb-dds-lg">{industrial.name}</h3>
                    <p className="font-body02-light mb-dds-md text-muted">{industrial.description}</p>
                    <p className="font-body02-light">{industrial.insight}</p>
                </article>
                <div className="portfolio-annotation-count">
                    <p className="font-display-light">{industrial.count}</p>
                    <p className="font-body02-light mt-dds-sm text-muted">{industrial.countLabel}</p>
                </div>
            </Reveal>
            <Reveal className="portfolio-document-study">
                <figure className="portfolio-document-figure" aria-label={kraftbox.diagram.caption}>
                    <div className="grid grid-cols-3 gap-dds-sm">
                        {kraftbox.diagram.forms.map((label) => (
                            <div key={label} className="portfolio-document">
                                <p className="font-body03-regular mb-dds-lg">{label}</p>
                                <div className="portfolio-document-lines" aria-hidden="true">
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        ))}
                    </div>
                </figure>
                <article>
                    <h3 className="font-feature-light mb-dds-lg">{kraftbox.name}</h3>
                    <p className="font-body02-light mb-dds-md text-muted">{kraftbox.description}</p>
                    <p className="font-body02-light">{kraftbox.insight}</p>
                </article>
            </Reveal>
        </section>
    );
}
