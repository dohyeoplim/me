import SectionHeading from "@/app/components/DDS/SectionHeading";
import LinkButton from "@/app/components/LinkButton";
import { background, beyondTheLab, experience } from "../../_data/background";

const { infrastructure, communities } = beyondTheLab;

export default function Background() {
    return (
        <>
            <section id="beyond-the-lab" className="portfolio-section">
                <SectionHeading title={beyondTheLab.title} />
                <div className="portfolio-experience">
                    <article>
                        <h3 className="font-work-title">{infrastructure.title}</h3>
                        <p>{infrastructure.description}</p>
                        <ul className="portfolio-responsibilities">
                            {infrastructure.responsibilities.map(({ title, detail }) => (
                                <li key={title}>
                                    <h4 className="font-body" lang="ko">{title}</h4>
                                    <p className="font-support text-muted">{detail}</p>
                                </li>
                            ))}
                        </ul>
                    </article>
                    <div className="portfolio-community">
                        <SectionHeading title={beyondTheLab.additionalTitle} variant="subsection" />
                        {communities.map(({ name, role, description }) => (
                            <article key={name}>
                                <h4 className="font-work-title">{name}</h4>
                                <p>{role}</p>
                                <p>{description}</p>
                            </article>
                        ))}
                        {beyondTheLab.visits.map((visit) => (
                            <article key={visit.name}>
                                <h4 className="font-work-title">{visit.name}</h4>
                                <p>{visit.role}, {visit.period}</p>
                                <p>{visit.description}</p>
                                <LinkButton href={visit.href} label={visit.project} icon="external" />
                            </article>
                        ))}
                    </div>
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
                </div>
                <p className="portfolio-achievement">{background.achievement}</p>
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
