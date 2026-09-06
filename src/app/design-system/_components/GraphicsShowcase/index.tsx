import SectionHeading from "@/app/components/DDS/SectionHeading";
import LottieGraphic from "@/app/components/DDS/LottieGraphic";
import ProjectVisual from "@/app/portfolio/_components/ProjectVisual";
import { projectAnimationSrc, projectScenes } from "@/app/portfolio/_data/project-scenes";
import { graphicColors, graphicExamples, graphicRules, graphicSpecs } from "./data";

export default function GraphicsShowcase() {
    return (
        <div className="dds-graphics-guide">
            <div className="dds-graphics-rules">
                {graphicRules.map(({ title, description }) => (
                    <div key={title}>
                        <h3 className="font-work-title">{title}</h3>
                        <p className="font-support text-muted">{description}</p>
                    </div>
                ))}
            </div>
            <div>
                <SectionHeading title="Palette" variant="subsection" />
                <div className="dds-graphics-palette">
                    {graphicColors.map(({ name, color }) => (
                        <div key={name}>
                            <div className="dds-graphics-swatch"
                                style={{ backgroundColor: color }} aria-hidden="true" />
                            <p className="font-support">{name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <SectionHeading title="Drawing and timing" variant="subsection" />
                <dl className="dds-graphics-specs font-support">
                    {graphicSpecs.map(({ name, value }) => (
                        <div key={name}><dt>{name}</dt><dd>{value}</dd></div>
                    ))}
                </dl>
                <p className="font-support text-muted">
                    Drawing measurements use canvas units. Custom silhouettes can use intermediate sizes.
                    Graphics scale to fit their container without cropping.
                </p>
            </div>
            <div>
                <SectionHeading title="In use" variant="subsection"
                    description="Loops pause outside the viewport. Reduced motion uses a still frame." />
                <div className="dds-graphics-examples">
                    {graphicExamples.map(({ kind, name, detail }) => (
                        <figure key={kind}>
                            <div className="dds-graphics-stage" role="img" aria-label={projectScenes[kind].label}>
                                <LottieGraphic src={projectAnimationSrc(kind)}>
                                    <ProjectVisual kind={kind} />
                                </LottieGraphic>
                            </div>
                            <figcaption>
                                <h3 className="font-work-title">{name}</h3>
                                <p className="font-support text-muted">{detail}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </div>
    );
}
