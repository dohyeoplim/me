import SectionHeading from "@/app/components/DDS/SectionHeading";
import DetailDialog from "@/app/components/DDS/DetailDialog";
import { research } from "../../_data/research";

const { programs, industrial, kraftbox } = research;

export default function ResearchPrograms() {
    return <div className="portfolio-supporting-research">
        <SectionHeading title={programs.title} variant="subsection" />
        <div className="portfolio-rd-cards">
            {([programs.industrial, programs.computing]).map((program, index) => (
                <article key={program.title} className="ds-panel portfolio-rd-card" data-dialog-origin>
                    <h4 className="font-body portfolio-role-title" lang="ko">{program.title.replaceAll(" ", "")}</h4>
                    <p className="font-support text-muted">{program.description}</p>
                    <div className="portfolio-rd-action">
                        <DetailDialog title={program.title.replaceAll(" ", "")} label="Project details"
                            expandFromCard triggerStyle="card" density="compact">
                            {index === 0 ? <div className="portfolio-research-list">
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
                                    {programs.computing.projectTitle}
                                </h4>
                                <p className="font-support text-muted">{programs.computing.role}</p>
                                <p className="font-support">{programs.computing.details}</p>
                                <p className="font-support">{programs.computing.infrastructure}</p>
                            </>}
                        </DetailDialog>
                    </div>
                </article>
            ))}
        </div>
    </div>;
}
