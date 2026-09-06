import SectionHeading from "@/app/components/DDS/SectionHeading";
import Reveal from "@/app/components/DDS/Reveal";
import Disclosure from "@/app/components/DDS/Disclosure";
import RecognitionDemo from "../RecognitionDemo";
import { research } from "../../_data/research";

const { eact, industrial, kraftbox } = research;

export default function Research() {
    return (
        <section id="research" className="portfolio-section">
            <div className="portfolio-section-intro">
                <SectionHeading title={research.title} />
                <p className="portfolio-research-overview">{research.portfolioSummary}</p>
            </div>
            <article className="portfolio-feature">
                <div className="portfolio-feature-intro">
                    <header className="portfolio-work-heading">
                        <h3 className="font-work-title">{eact.name}</h3>
                        <p className="font-support text-muted">{eact.role}, {eact.status}</p>
                    </header>
                    <p className="portfolio-research-intro">{eact.description}</p>
                </div>
                <RecognitionDemo />
                <Disclosure label={eact.detailsLabel} contentTone="subtle">
                    <div className="portfolio-paper">
                        <p>{eact.contributions}</p>
                        <p className="portfolio-paper-title">{eact.paper}</p>
                        <p className="font-support text-muted">{eact.authors}</p>
                    </div>
                </Disclosure>
            </article>
            <Reveal className="portfolio-research-list">
                <article>
                    <h3 className="font-work-title">{industrial.name}</h3>
                    <p>{industrial.description}</p>
                    <p>
                        {industrial.count} {industrial.countLabel}. {industrial.insight}
                    </p>
                </article>
                <article>
                    <h3 className="font-work-title">{kraftbox.name}</h3>
                    <p>{kraftbox.description}</p>
                    <p>{kraftbox.insight}</p>
                </article>
            </Reveal>
            {research.additionalPublications.map((publication) => (
                <article key={publication.title} className="portfolio-publication">
                    <h3 className="font-body">{publication.title}</h3>
                    <p className="font-support text-muted">{publication.authors}</p>
                    <p className="font-support">{publication.role}, {publication.status}</p>
                </article>
            ))}
        </section>
    );
}
