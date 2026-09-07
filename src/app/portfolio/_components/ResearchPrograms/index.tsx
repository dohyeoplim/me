import SectionHeading from "@/app/components/DDS/SectionHeading";
import DetailDialog from "@/app/components/DDS/DetailDialog";
import { research } from "../../_data/research";

const { programs, industrial, kraftbox } = research;

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
                            {!("projectTitle" in program) ? <div className="portfolio-research-list">
                                <article>
                                    <h4 className="font-body portfolio-role-title">{industrial.name}</h4>
                                    <p className="font-support">{industrial.description}</p>
                                    <p className="font-support">
                                        {industrial.count} {industrial.countLabel}. {industrial.insight}
                                    </p>
                                </article>
                                <article>
                                    <h4 className="font-body portfolio-role-title">{kraftbox.name}</h4>
                                    <p className="font-support">{kraftbox.description}</p>
                                    <p className="font-support">{kraftbox.insight}</p>
                                </article>
                            </div> : <>
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
