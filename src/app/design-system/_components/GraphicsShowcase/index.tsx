import SectionHeading from "@/app/components/DDS/SectionHeading";
import Illustration from "@/app/components/DDS/Illustration";
import { graphicColors, graphicElements, graphicRules, graphicSpecs } from "./data";
import MotionShowcase from "../MotionShowcase";

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
                            <p className="font-support text-muted">{color.toUpperCase()}</p>
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
            </div>
            <div>
                <SectionHeading title="Elements" variant="subsection" />
                <div className="dds-graphics-elements">
                    {graphicElements.map(({ scene, name, frame }) => (
                        <figure key={name}>
                            <div className="dds-graphics-element" data-element={name.toLowerCase()}>
                                <Illustration scene={scene} frame={frame} />
                            </div>
                            <figcaption>
                                <p className="font-support">{name}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
            <div>
                <SectionHeading title="Motion" variant="subsection" />
                <MotionShowcase />
            </div>
        </div>
    );
}
