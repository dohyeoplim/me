import Image from "next/image";
import { ArrowDown } from "lucide-react";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Reveal from "@/app/components/DDS/Reveal";
import LinkButton from "@/app/components/LinkButton";
import ProjectVisual from "../ProjectVisual";
import { projects, projectSection } from "../../_data/projects";

export default function Projects() {
    return (
        <section id="projects" className="ds-section border-t border-line">
            <SectionHeading title={projectSection.title} />
            <div className="portfolio-projects">
                {projects.map((project) => (
                    <Reveal key={project.name} className="portfolio-project">
                        <figure className="portfolio-project-media" aria-label={projectSection.visualCaption}>
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
                        </figure>
                        <article>
                            <h3 className="font-title02-light mb-dds-md">{project.name}</h3>
                            <p className="font-body01-light mb-dds-lg">{project.description}</p>
                            <p className="font-body02-light mb-dds-lg text-muted">{project.contribution}</p>
                            <details className="group mb-dds-lg">
                                <summary className="font-body03-regular flex w-fit cursor-pointer list-none gap-dds-xs">
                                    {projectSection.detailsLabel}
                                    <ArrowDown size={16} className="transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="font-body02-light mt-dds-md text-muted">{project.outcome}</p>
                            </details>
                            {project.recognition && (
                                <p className="font-body03-regular mb-dds-lg">{project.recognition}</p>
                            )}
                            <div className="flex flex-wrap items-baseline justify-between gap-dds-md">
                                <p className="font-body03-light text-muted">{project.period}</p>
                                <LinkButton
                                    href={project.href}
                                    label={projectSection.repositoryLabel}
                                    icon="external"
                                    aria-label={`${project.name} on GitHub`}
                                />
                            </div>
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
