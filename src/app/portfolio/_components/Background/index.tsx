import SectionHeading from "@/app/components/DDS/SectionHeading";
import LinkButton from "@/app/components/LinkButton";
import { background, beyondTheLab, experience } from "../../_data/background";

const { communities } = beyondTheLab;

export default function Background() {
    return (
        <>
            <section id="beyond-the-lab" className="portfolio-section">
                <SectionHeading title={beyondTheLab.title} />
                <div className="portfolio-additional">
                    <SectionHeading title={beyondTheLab.additionalTitle} variant="subsection" />
                    {beyondTheLab.visits.map((visit) => (
                        <article key={visit.name}>
                            <div>
                                <h4 className="font-body portfolio-role-title">{visit.name}</h4>
                                <p className="font-support text-muted">{visit.period}</p>
                            </div>
                            <div>
                                <p>{visit.description}</p>
                                <LinkButton href={visit.href} label={visit.project} icon="external" />
                            </div>
                        </article>
                    ))}
                </div>
                <div className="portfolio-community">
                    <SectionHeading title={beyondTheLab.communityTitle} variant="subsection" />
                    {communities.map((community) => (
                        <article key={community.name}>
                            <div>
                                <h4 className="font-body portfolio-role-title">{community.name}</h4>
                                <p className="font-support text-muted">{community.period}</p>
                            </div>
                            <div>
                                <p>{community.role}</p>
                                <p>{community.description}</p>
                                {community.href && (
                                    <LinkButton href={community.href} label="Website" icon="external" />
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            <section id="background" className="portfolio-section">
                <SectionHeading title={background.title} />
                <div className="portfolio-education">
                    {background.education.map(({ school, course, period }) => (
                        <article key={school}>
                            <h3 className="font-work-title">{school}</h3>
                            <p>{course}</p>
                            <p className="font-support text-muted">{period}</p>
                        </article>
                    ))}
                    <p className="portfolio-achievement">{background.achievement}</p>
                </div>
                <div className="portfolio-skills">
                    <SectionHeading title={background.experienceTitle} variant="subsection" />
                    <dl>
                        {experience.map(({ label, items }) => (
                            <div key={label}>
                                <dt>{label}</dt>
                                <dd>{items}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        </>
    );
}
