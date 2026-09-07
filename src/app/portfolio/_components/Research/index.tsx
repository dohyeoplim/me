import SectionHeading from "@/app/components/DDS/SectionHeading";
import RecognitionDemo from "../RecognitionDemo";
import ResearchPrograms from "../ResearchPrograms";
import PublicationAuthors from "../PublicationAuthors";
import { research, researchPublications } from "../../_data/research";

const { eact } = research;

export default function Research() {
    return (
        <section id="research" className="portfolio-section">
            <div className="portfolio-section-intro">
                <SectionHeading title={research.title} />
                <p className="portfolio-research-overview">{research.portfolioSummary}</p>
            </div>
            <div className="portfolio-publications">
                <SectionHeading title={research.publicationsTitle} variant="subsection" />
                {researchPublications.map((publication) => (
                    <article key={publication.title} className="portfolio-publication">
                        <h4 className="font-body portfolio-role-title">{publication.title}</h4>
                        <PublicationAuthors authors={publication.authors} status={publication.status} />
                        {publication.title === eact.paper && (
                            <div className="portfolio-publication-detail">
                                <div className="portfolio-research-summary">
                                    <p className="portfolio-research-intro">{eact.description}</p>
                                    <p className="portfolio-research-contribution font-support">
                                        {eact.contributions}
                                    </p>
                                </div>
                                <RecognitionDemo />
                            </div>
                        )}
                    </article>
                ))}
            </div>
            <ResearchPrograms />
        </section>
    );
}
