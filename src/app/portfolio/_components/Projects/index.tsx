import Image from "next/image";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Badge from "@/app/components/DDS/Badge";
import Reveal from "@/app/components/DDS/Reveal";
import LinkButton from "@/app/components/LinkButton";
import ProjectVisual from "../ProjectVisual";
import { projects } from "../../_data/projects";
import { projectSection } from "../../_data/projects";

export default function Projects() {
    return (
        <section id="projects" className="ds-section border-t border-grey-200">
            <SectionHeading number="02" title={projectSection.title} description={projectSection.description} />
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
                {projects.map((project) => (
                    <Reveal key={project.name}>
                        <article className="flex h-full flex-col">
                            <figure className="mb-6">
                                <div className="relative h-60 overflow-hidden rounded-2xl bg-grey-100/80">
                                    {project.image ? (
                                        <Image
                                            src={project.image.src}
                                            alt={project.image.alt}
                                            fill
                                            sizes="(max-width: 768px) calc(100vw - 48px), 408px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <ProjectVisual kind={project.visual} />
                                    )}
                                </div>
                                {!project.image && (
                                    <figcaption className="mt-2 text-xs text-grey-500">
                                        {projectSection.visualCaption}
                                    </figcaption>
                                )}
                            </figure>
                            <div className="mb-3 flex items-center justify-between gap-4">
                                <h3 className="font-head01-medium">{project.name}</h3>
                                <LinkButton
                                    href={project.href}
                                    label={projectSection.repositoryLabel}
                                    icon="external"
                                    aria-label={`${project.name} on GitHub`}
                                />
                            </div>
                            <p className="ds-label mb-5">{project.period}</p>
                            <h4 className="mb-3 text-2xl font-light leading-snug tracking-tight">{project.title}</h4>
                            <p className="font-body02-light mb-4 text-grey-600">{project.description}</p>
                            <p className="font-body02-light mb-5 text-grey-600">{project.contribution}</p>
                            <p className="font-body02-light mb-6 border-l border-grey-200 pl-4">{project.outcome}</p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <Badge key={tag}>{tag}</Badge>
                                ))}
                            </div>
                            {project.recognition && (
                                <p className="mt-5 text-sm leading-6 text-grey-600">{project.recognition}</p>
                            )}
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
