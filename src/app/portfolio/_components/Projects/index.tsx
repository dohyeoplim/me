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
                {projects.filter((project) => project.placement !== "additional").map((project) => (
                    <Reveal key={project.name}>
                        <article className="portfolio-project">
                            <header className="portfolio-project-heading">
                                <h3 className="font-work-title">{project.name}</h3>
                                <p className="portfolio-project-purpose">{project.title}</p>
                            </header>
                            <figure className="portfolio-project-media" aria-label={`${project.name} process diagram`}>
                                {project.image ? (
                                    <Image
                                        src={project.image.src}
                                        alt={project.image.alt}
                                        fill
                                        sizes="(max-width: 767px) calc(100vw - 48px), 400px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <LottieGraphic src={`/animations/${project.visual}.json`}>
                                        <ProjectVisual kind={project.visual} />
                                    </LottieGraphic>
                                )}
                            </figure>
                            <div className="portfolio-project-content">
                                <p>{project.contribution}</p>
                                {project.recognition && <p className="portfolio-recognition">{project.recognition}</p>}
                                {project.outcome && (
                                    <Disclosure label={projectSection.detailsLabel} variant="plain">
                                        <p>{project.outcome}</p>
                                    </Disclosure>
                                )}
                            </div>
                            <footer className="portfolio-project-footer">
                                <p className="portfolio-project-period">{project.period}</p>
                                <LinkButton
                                    href={project.href}
                                    label={projectSection.repositoryLabel}
                                    icon="external"
                                    aria-label={`${project.name} on GitHub`}
                                />
                            </footer>
                        </article>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
