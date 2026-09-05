import SectionHeading from "@/app/components/DDS/SectionHeading";
import Reveal from "@/app/components/DDS/Reveal";
import { background, beyondTheLab, experience } from "../../_data/background";

const { infrastructure, communities } = beyondTheLab;

export default function Background() {
    return (
        <>
            <section id="beyond-the-lab" className="ds-section border-t border-line">
                <SectionHeading title={beyondTheLab.title} />
                <Reveal>
                    <div className="grid gap-dds-2xl md:grid-cols-2">
                        <div>
                            <h3 className="font-head01-medium mb-dds-lg">{infrastructure.title}</h3>
                            <p className="font-body02-light text-muted">{infrastructure.description}</p>
                            <p className="font-body02-light mt-dds-md text-muted">{infrastructure.interest}</p>
                        </div>
                        <dl className="space-y-dds-lg">
                            {infrastructure.responsibilities.map(({ title, detail }) => (
                                <div key={title}>
                                    <dt className="font-body02-regular mb-dds-xs">{title}</dt>
                                    <dd className="font-body02-light text-muted">{detail}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <div className="mt-dds-3xl grid gap-dds-2xl sm:grid-cols-2">
                        {communities.map(({ name, role, description }) => (
                            <div key={name}>
                                <h3 className="font-head01-medium mb-dds-md">{name}</h3>
                                <p className="font-body02-light mb-dds-md">{role}</p>
                                <p className="font-body02-light text-muted">{description}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </section>
            <section id="background" className="ds-section border-t border-line">
                <SectionHeading title={background.title} />
                <Reveal>
                    <div className="space-y-dds-xl">
                        {background.education.map(({ school, course, period }) => (
                            <div key={school} className="grid gap-dds-md sm:grid-cols-[1fr_auto]">
                                <div>
                                    <h3 className="font-head01-medium">{school}</h3>
                                    <p className="font-body02-light mt-dds-xs text-muted">{course}</p>
                                </div>
                                <p className="font-body03-light text-muted">{period}</p>
                            </div>
                        ))}
                    </div>
                    <p className="font-body01-light mt-dds-xl max-w-2xl">{background.achievement}</p>
                    <h3 className="font-head01-medium mb-dds-xl mt-dds-3xl">{background.experienceTitle}</h3>
                    <dl className="space-y-dds-lg">
                        {experience.map(({ label, items }) => (
                            <div key={label} className="grid gap-dds-xs sm:grid-cols-[200px_1fr]">
                                <dt className="font-body02-regular">{label}</dt>
                                <dd className="font-body02-light text-muted">{items}</dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>
            </section>
            <Reveal className="portfolio-closing">
                <h2 className="font-feature-light mb-dds-lg max-w-2xl">{background.next.question}</h2>
                <p className="font-body02-light max-w-xl text-muted">{background.next.description}</p>
            </Reveal>
        </>
    );
}
