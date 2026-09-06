import Image from "next/image";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import LinkButton from "@/app/components/LinkButton";
import LottieGraphic from "@/app/components/DDS/LottieGraphic";
import GalleryCard from "@/app/components/DDS/GalleryCard";
import Carousel from "@/app/components/DDS/Carousel";
import ProjectVisual from "../ProjectVisual";
import { projects, projectSection } from "../../_data/projects";
import { projectAnimationSrc, projectScenes } from "../../_data/project-scenes";

export default function Projects() {
    return (
        <section id="projects" className="portfolio-section">
            <SectionHeading title={projectSection.title} />
            <Carousel label={projectSection.title} variant="full-bleed">
                {projects.map((project) => (
                    <GalleryCard key={project.name} title={project.name} description={project.title}
                        detailsLabel={projectSection.detailsLabel} mediaLabel={projectScenes[project.visual].label}
                        media={project.image ? (
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
                        >
                                <div className="portfolio-project-content">
                                    <p className="font-support">{project.contribution}</p>
                                    {project.recognition && (
                                        <p className="portfolio-recognition">{project.recognition}</p>
                                    )}
                                </div>
                                {project.outcome && <p className="font-support">{project.outcome}</p>}
                                <footer className="portfolio-project-footer">
                                    {project.period && <p className="portfolio-project-period">{project.period}</p>}
                                    <LinkButton
                                        href={project.href}
                                        label={projectSection.repositoryLabel}
                                        icon="external"
                                        aria-label={`${project.name} on GitHub`}
                                    />
                                </footer>
                    </GalleryCard>
                ))}
            </Carousel>
        </section>
    );
}
