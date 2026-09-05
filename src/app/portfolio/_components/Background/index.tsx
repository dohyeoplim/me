import { ArrowUpRight, Container, Cpu, Network } from "lucide-react";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Reveal from "@/app/components/DDS/Reveal";
import Surface from "@/app/components/DDS/Surface";
import Metric from "@/app/components/DDS/Metric";
import { background, beyondTheLab, experience } from "../../_data/background";

const icons = { gpu: Cpu, container: Container, network: Network };
const { infrastructure, communities } = beyondTheLab;

export default function Background() {
    return (
        <>
            <section id="beyond-the-lab" className="ds-section border-t border-grey-200">
                <SectionHeading number="03" title={beyondTheLab.title} />
                <Reveal>
                    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
                        <div>
                            <h3 className="font-head01-medium mb-4">{infrastructure.title}</h3>
                            <p className="font-body02-light text-grey-600">{infrastructure.description}</p>
                            <p className="font-body02-light mt-4 text-grey-600">{infrastructure.interest}</p>
                        </div>
                        <Surface className="divide-y divide-grey-100 px-5">
                            {infrastructure.responsibilities.map(({ icon, title, detail }) => {
                                const Icon = icons[icon as keyof typeof icons];
                                return (
                                    <div key={title} className="flex items-center gap-4 py-5">
                                        <Icon size={20} strokeWidth={1.2} className="shrink-0 text-grey-500" />
                                        <div>
                                            <p className="mb-1 text-sm">{title}</p>
                                            <p className="text-sm text-grey-500">{detail}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </Surface>
                    </div>
                    <div className="mt-16 grid gap-10 sm:grid-cols-2">
                        {communities.map(({ name, period, role, description }) => (
                            <div key={name}>
                                <p className="ds-label mb-3">{period}</p>
                                <h3 className="font-head01-medium mb-2">{name}</h3>
                                <p className="font-body03-regular mb-4 text-grey-600">{role}</p>
                                <p className="font-body02-light text-grey-600">{description}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </section>
            <section id="background" className="ds-section border-t border-grey-200">
                <SectionHeading number="04" title={background.title} />
                <Reveal>
                    <div className="mb-14 grid gap-8 sm:grid-cols-3">
                        {background.metrics.map((metric) => (
                            <Metric key={metric.label} {...metric} />
                        ))}
                    </div>
                    <div className="space-y-7 border-y border-grey-200 py-8">
                        {background.education.map(({ school, course, period }) => (
                            <div key={school} className="flex flex-col justify-between gap-2 sm:flex-row">
                                <div>
                                    <h3 className="font-body02-regular">{school}</h3>
                                    <p className="font-body02-light mt-1 text-grey-600">{course}</p>
                                </div>
                                <p className="ds-label shrink-0 sm:pt-1">{period}</p>
                            </div>
                        ))}
                    </div>
                    <h3 className="font-head01-medium mb-7 mt-14">{background.experienceTitle}</h3>
                    <dl className="space-y-6">
                        {experience.map(({ label, items }) => (
                            <div key={label} className="grid gap-2 sm:grid-cols-[200px_1fr]">
                                <dt className="text-sm text-grey-500">{label}</dt>
                                <dd className="font-body02-light text-grey-700">{items}</dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>
            </section>
            <Reveal className="border-t border-grey-200 pb-4 pt-16">
                <p className="ds-label mb-6">{background.next.label}</p>
                <p className="max-w-3xl text-3xl font-light leading-snug tracking-tight sm:text-4xl">
                    {background.next.question}
                </p>
                <p className="font-body02-light mb-8 mt-6 max-w-xl text-grey-600">{background.next.description}</p>
                <a
                    href="#research"
                    className="inline-flex items-center gap-2 py-2 text-sm text-grey-600 hover:text-grey-900"
                >
                    {background.next.action} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
            </Reveal>
        </>
    );
}
