import Image from "next/image";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Reveal from "@/app/components/DDS/Reveal";
import LinkButton from "@/app/components/LinkButton";
import LottieGraphic from "@/app/components/DDS/LottieGraphic";
import Disclosure from "@/app/components/DDS/Disclosure";
import ProjectVisual from "../ProjectVisual";
import { projects, projectSection } from "../../_data/projects";

export default function Projects() {
    return (
        <section id="projects" className="portfolio-section">
            <SectionHeading title={projectSection.title} />
            <div className="portfolio-projects">
                {projects.map((project) => (
                    <Reveal key={project.name}>
                        <article className="portfolio-project">
                            <div className="portfolio-project-content">
                                <header className="portfolio-work-heading">
                                    <h3 className="font-work-title">{project.name}</h3>
                                    <LinkButton
                                        href={project.href}
                                        label={projectSection.repositoryLabel}
                                        icon="external"
                                        aria-label={`${project.name} on GitHub`}
                                    />
                                </header>
                                <p className="portfolio-project-purpose">{project.title}</p>
                                <p>{project.contribution}</p>
                                {project.outcome && (
                                    <Disclosure label={projectSection.detailsLabel} variant="plain">
                                        <p>{project.outcome}</p>
                                    </Disclosure>
                                )}
                                {project.recognition && <p className="portfolio-recognition">{project.recognition}</p>}
                                <p className="portfolio-project-period">{project.period}</p>
                            </div>
                            <figure className="portfolio-project-media" aria-label={`${project.name} process diagram`}>
                                {project.image ? (
                                    <Image
                                        src={project.image.src}
                                        alt={project.image.alt}
                                        fill
                                        sizes="(max-width: 640px) calc(100vw - 48px), 240px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <LottieGraphic src={`/animations/${project.visual}.json`}>
                                        <ProjectVisual kind={project.visual} />
                                    </LottieGraphic>
                                )}
                            </figure>
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
