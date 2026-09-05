import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/app/components/DDS/Button";
import Disclosure from "@/app/components/DDS/Disclosure";
import LottieGraphic from "@/app/components/DDS/LottieGraphic";
import Metric from "@/app/components/DDS/Metric";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Surface from "@/app/components/DDS/Surface";
import { profileCardRegistry, type ProfileCard, type ProfileCardId } from "@/app/lib/profile-chat/types";
import { background, beyondTheLab, experience } from "@/app/portfolio/_data/background";
import { hero } from "@/app/portfolio/_data/hero";
import { projects } from "@/app/portfolio/_data/projects";
import { research } from "@/app/portfolio/_data/research";
import ProjectVisual from "@/app/portfolio/_components/ProjectVisual";
import RecognitionDemo from "@/app/portfolio/_components/RecognitionDemo";

type CardProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

type Props = {
    cards: ReadonlyArray<{ type: ProfileCard["type"]; id: string }>;
};

function AnswerCard({ title, description, children }: CardProps) {
    return (
        <article className="dds-answer-card" aria-label={title}>
            <Surface padding="compact" className="dds-answer-card-surface">
                <SectionHeading title={title} description={description} variant="subsection" as="h3" />
                {children}
            </Surface>
        </article>
    );
}

function ProfileCardContent() {
    return (
        <AnswerCard title={hero.name}>
            <div className="dds-answer-profile">
                <Image
                    src={hero.image.src}
                    alt={hero.image.alt}
                    width={64}
                    height={64}
                    className="dds-answer-portrait"
                />
                <div className="dds-answer-copy">
                    <p className="font-body">{hero.title}</p>
                    <p>{hero.bio}</p>
                </div>
            </div>
        </AnswerCard>
    );
}

function EactCard() {
    const { eact } = research;

    return (
        <AnswerCard title={eact.name}>
            <p className="font-support text-muted">
                {eact.role}, {eact.status}
            </p>
            <RecognitionDemo />
            <p className="dds-answer-finding font-body">{eact.result}</p>
            <Disclosure label={eact.detailsLabel} variant="plain">
                <p>{eact.description}</p>
                <p>{eact.errorResult}</p>
                <p>{eact.paper}</p>
                <p className="font-support text-muted">{eact.authors}</p>
            </Disclosure>
        </AnswerCard>
    );
}

function IndustrialCard() {
    const { industrial } = research;

    return (
        <AnswerCard title={industrial.name}>
            <div className="dds-answer-copy">
                <Metric value={industrial.count} label={industrial.countLabel} />
                <p>{industrial.description}</p>
            </div>
            <Disclosure label="Evaluation finding" variant="plain">
                <p>{industrial.insight}</p>
            </Disclosure>
        </AnswerCard>
    );
}

function KraftboxCard() {
    const { kraftbox } = research;

    return (
        <AnswerCard title={kraftbox.name}>
            <p className="font-support">{kraftbox.description}</p>
            <Disclosure label="Model evaluation" variant="plain">
                <p>{kraftbox.insight}</p>
            </Disclosure>
        </AnswerCard>
    );
}

function ProjectCard({ name }: { name: string }) {
    const project = projects.find((item) => item.name === name);
    if (!project) return null;

    return (
        <AnswerCard title={project.name} description={project.title}>
            <div className="dds-answer-project">
                <figure className="dds-answer-media" aria-label={`${project.name}, ${project.title}`}>
                    {project.image ? (
                        <Image
                            src={project.image.src}
                            alt={project.image.alt}
                            fill
                            sizes="(max-width: 639px) calc(100vw - 96px), 256px"
                            className="dds-answer-image"
                        />
                    ) : (
                        <LottieGraphic src={`/animations/${project.visual}.json`}>
                            <ProjectVisual kind={project.visual} />
                        </LottieGraphic>
                    )}
                </figure>
                <div className="dds-answer-project-content">
                    <div className="dds-answer-copy">
                        <p>{project.contribution}</p>
                        {project.recognition && <p>{project.recognition}</p>}
                    </div>
                    {project.outcome && (
                        <Disclosure label="Project details" variant="plain">
                            <p>{project.outcome}</p>
                        </Disclosure>
                    )}
                    <footer className="dds-answer-footer">
                        <p className="font-support text-muted">{project.period}</p>
                        <ButtonLink
                            href={project.href}
                            variant="outline"
                            size="small"
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.name} on GitHub`}
                        >
                            GitHub <ArrowUpRight size={14} aria-hidden="true" />
                        </ButtonLink>
                    </footer>
                </div>
            </div>
        </AnswerCard>
    );
}

function EducationCard() {
    return (
        <AnswerCard title="Education">
            <div className="dds-answer-records">
                {background.education.map((education) => (
                    <div className="dds-answer-copy" key={education.school}>
                        <h4 className="font-body">{education.school}</h4>
                        <p>{education.course}</p>
                        <p className="text-muted">{education.period}</p>
                    </div>
                ))}
            </div>
            <Disclosure label="Academic record" variant="plain">
                <p>{background.achievement}</p>
            </Disclosure>
        </AnswerCard>
    );
}

function InfrastructureCard() {
    const { infrastructure } = beyondTheLab;

    return (
        <AnswerCard title={infrastructure.title}>
            <p className="font-support">{infrastructure.description}</p>
            <dl className="dds-answer-facts">
                {infrastructure.responsibilities.map(({ title, detail }) => (
                    <div key={title}>
                        <dt>{title}</dt>
                        <dd>{detail}</dd>
                    </div>
                ))}
            </dl>
        </AnswerCard>
    );
}

function CommunityCard() {
    return (
        <AnswerCard title="Community">
            <div className="dds-answer-records">
                {beyondTheLab.communities.map((community) => (
                    <div className="dds-answer-copy" key={community.name}>
                        <h4 className="font-body">{community.name}</h4>
                        <p>{community.role}</p>
                        <p>{community.description}</p>
                        <p className="text-muted">{community.period}</p>
                    </div>
                ))}
            </div>
        </AnswerCard>
    );
}

function SkillsCard() {
    return (
        <AnswerCard title={background.experienceTitle}>
            <dl className="dds-answer-facts">
                {experience.map(({ label, items }) => (
                    <div key={label}>
                        <dt>{label}</dt>
                        <dd>{items}</dd>
                    </div>
                ))}
            </dl>
        </AnswerCard>
    );
}

const cardRenderers = {
    profile: () => <ProfileCardContent />,
    eact: () => <EactCard />,
    "industrial-ocr": () => <IndustrialCard />,
    kraftbox: () => <KraftboxCard />,
    mochicall: () => <ProjectCard name="MochiCall" />,
    collog: () => <ProjectCard name="Collog" />,
    wonnit: () => <ProjectCard name="WONNIT" />,
    docfusionx: () => <ProjectCard name="DocFusionX" />,
    education: () => <EducationCard />,
    infrastructure: () => <InfrastructureCard />,
    community: () => <CommunityCard />,
    skills: () => <SkillsCard />,
} satisfies Record<ProfileCardId, () => ReactNode>;

export default function ProfileChatCards({ cards }: Props) {
    const selected = cards.filter((card, index) => {
        if (!Object.hasOwn(profileCardRegistry, card.id)) return false;
        const registered = profileCardRegistry[card.id as ProfileCardId];
        return registered.type === card.type && cards.findIndex((item) => item.id === card.id) === index;
    });

    if (!selected.length) return null;

    return (
        <div className="dds-answer-cards">
            {selected.map(({ id }) => (
                <div key={id}>{cardRenderers[id as ProfileCardId]()}</div>
            ))}
        </div>
    );
}
