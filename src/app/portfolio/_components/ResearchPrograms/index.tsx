import SectionHeading from "@/app/components/DDS/SectionHeading";
import DetailDialog from "@/app/components/DDS/DetailDialog";
import IndustrialResearch from "../IndustrialResearch";
import { research } from "../../_data/research";

const { programs } = research;

export default function ResearchPrograms() {
    return <div className="portfolio-supporting-research">
        <SectionHeading title={programs.title} variant="subsection" />
        <div className="portfolio-rd-cards">
            {([programs.industrial, programs.computing, programs.culture] as const).map((program) => (
                <article key={program.title} className="ds-panel portfolio-rd-card"
                    data-featured={program === programs.industrial} data-dialog-origin>
                    <h4 className="font-body portfolio-role-title" lang="ko">{program.title.replaceAll(" ", "")}</h4>
                    <p className="font-support text-muted">{program.description}</p>
                    <div className="portfolio-rd-action">
                        <DetailDialog title={program.title.replaceAll(" ", "")} label="Project details"
                            expandFromCard triggerStyle="card" density="compact">
                            {!("projectTitle" in program) ? <IndustrialResearch /> : <>
                                <h4 className="font-body portfolio-role-title" lang="ko">
                                    {program.projectTitle}
                                </h4>
                                {"role" in program && <p className="font-support text-muted">{program.role}</p>}
                                <p className="font-support">{program.details}</p>
                                {"infrastructure" in program && (
                                    <p className="font-support">{program.infrastructure}</p>
                                )}
                            </>}
                        </DetailDialog>
                    </div>
                </article>
            ))}
        </div>
    </div>;
}
