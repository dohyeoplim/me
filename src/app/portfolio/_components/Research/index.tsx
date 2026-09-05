import SectionHeading from "@/app/components/DDS/SectionHeading";
import Reveal from "@/app/components/DDS/Reveal";
import Disclosure from "@/app/components/DDS/Disclosure";
import RecognitionDemo from "../RecognitionDemo";
import { research } from "../../_data/research";

const { eact, industrial, kraftbox } = research;

export default function Research() {
    return (
        <section id="research" className="portfolio-section">
            <SectionHeading title={research.title} />
            <article className="portfolio-feature">
                <header className="portfolio-work-heading">
                    <h3 className="font-work-title">{eact.name}</h3>
                    <p className="font-support text-muted">
                        {eact.role}, {eact.status}
                    </p>
                </header>
                <p className="font-body portfolio-measure">{eact.description}</p>
                <RecognitionDemo />
                <div className="portfolio-findings">
                    <p className="font-body">{eact.result}</p>
                </div>
                <Disclosure label={eact.detailsLabel}>
                    <div className="portfolio-paper">
                        <p>{eact.contributions}</p>
                        <p>{eact.errorResult}</p>
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
        </section>
    );
}
