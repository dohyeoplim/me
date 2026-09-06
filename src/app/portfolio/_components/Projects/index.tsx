import Image from "next/image";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import LinkButton from "@/app/components/LinkButton";
import LottieGraphic from "@/app/components/DDS/LottieGraphic";
import DetailDialog from "@/app/components/DDS/DetailDialog";
import Carousel from "@/app/components/DDS/Carousel";
import ProjectVisual from "../ProjectVisual";
import { projects, projectSection } from "../../_data/projects";
import { projectAnimationSrc, projectScenes } from "../../_data/project-scenes";

export default function Projects() {
    return (
        <section id="projects" className="portfolio-section">
            <SectionHeading title={projectSection.title} />
            <Carousel label={projectSection.title}>
                {projects.filter((project) => project.placement !== "additional").map((project) => (
                    <article key={project.name} className="portfolio-project-card">
                        <header className="portfolio-project-heading">
                            <h3 className="font-work-title">{project.name}</h3>
                            <p className="portfolio-project-purpose">{project.title}</p>
                        </header>
                        <figure
                            className="portfolio-project-media"
                            aria-label={projectScenes[project.visual].label}
                        >
                            {project.image ? (
                                <Image
                                    src={project.image.src}
                                    alt={project.image.alt}
                                    fill
                                    sizes="(max-width: 767px) calc(100vw - 48px), 420px"
                                    className="object-cover"
                                />
                            ) : (
                                <LottieGraphic src={projectAnimationSrc(project.visual)}>
                                    <ProjectVisual kind={project.visual} />
                                </LottieGraphic>
                            )}
                        </figure>
                        <div className="portfolio-project-card-action">
                            <DetailDialog title={project.name} label={projectSection.detailsLabel}>
                                <div className="portfolio-project-content">
                                    <p>{project.contribution}</p>
                                    {project.recognition && (
                                        <p className="portfolio-recognition">{project.recognition}</p>
                                    )}
                                </div>
                                {project.outcome && <p>{project.outcome}</p>}
                                <footer className="portfolio-project-footer">
                                    <p className="portfolio-project-period">{project.period}</p>
                                    <LinkButton
                                        href={project.href}
                                        label={projectSection.repositoryLabel}
                                        icon="external"
                                        aria-label={`${project.name} on GitHub`}
                                    />
                                </footer>
                            </DetailDialog>
                        </div>
                    </article>
                ))}
            </Carousel>
        </section>
    );
}
