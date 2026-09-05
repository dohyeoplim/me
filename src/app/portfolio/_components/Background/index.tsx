import SectionHeading from "@/app/components/DDS/SectionHeading";
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
                                <li key={title}>{detail}</li>
                            ))}
                        </ul>
                    </article>
                    <div className="portfolio-community">
                        {communities.map(({ name, role, description }) => (
                            <article key={name}>
                                <h3 className="font-work-title">{name}</h3>
                                <p>{role}</p>
                                <p>{description}</p>
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
