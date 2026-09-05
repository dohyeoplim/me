import { ArrowUpRight } from "lucide-react";
import Badge from "@/app/components/DDS/Badge";
import { ButtonLink } from "@/app/components/DDS/Button";
import Metric from "@/app/components/DDS/Metric";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Surface from "@/app/components/DDS/Surface";
import TextField from "@/app/components/DDS/TextField";
import Disclosure from "@/app/components/DDS/Disclosure";
import LinkButton from "@/app/components/LinkButton";
import { surfaceVariants } from "../../data";

export default function ComponentShowcase() {
    return (
        <>
            <div className="dds-guide-group">
                <SectionHeading title="Headings" variant="subsection" />
                <Surface padding="comfortable" className="dds-specimen-stack">
                    <SectionHeading title="Research" description="Document understanding and recognition." />
                    <SectionHeading
                        title="Industrial OCR"
                        variant="subsection"
                        description="Evaluation data and recognition experiments."
                    />
                </Surface>
            </div>
            <div className="dds-guide-group dds-specimen-grid">
                <div>
                    <SectionHeading title="Results" variant="subsection" />
                    <Surface padding="compact" className="dds-specimen-stack">
                        <Metric value="8,000" label="images annotated" />
                        <Metric
                            value="12.3 to 31.2 pp"
                            label="improvement in exact-match accuracy"
                            detail="Across four structured identifier benchmarks."
                            variant="stacked"
                        />
                    </Surface>
                </div>
                <div>
                    <SectionHeading title="Links" variant="subsection" />
                    <Surface padding="compact" className="dds-specimen-stack">
                        <LinkButton href="/portfolio" label="View portfolio" />
                        <LinkButton href="https://github.com/dohyeoplim" label="GitHub" icon="external" />
                        <div>
                            <ButtonLink href="https://github.com/dohyeoplim" variant="outline">
                                GitHub <ArrowUpRight size={16} aria-hidden="true" />
                            </ButtonLink>
                        </div>
                    </Surface>
                </div>
            </div>
            <div className="dds-guide-group">
                <SectionHeading
                    title="Fields"
                    variant="subsection"
                    description="Labels and guidance stay close to the input."
                />
                <div className="dds-specimen-grid">
                    <Surface padding="compact" className="dds-specimen-stack">
                        <TextField
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            hint="Used only for a reply."
                        />
                        <TextField label="Password" type="password" placeholder="Enter password" />
                    </Surface>
                    <Surface padding="compact" className="dds-specimen-stack">
                        <TextField label="Search" placeholder="Find a project" variant="line" />
                        <TextField label="Project name" defaultValue="Collog" error="Check this value." />
                    </Surface>
                </div>
            </div>
            <div className="dds-guide-group">
                <SectionHeading title="Surfaces" variant="subsection" />
                <div className="dds-specimen-stack">
                    {surfaceVariants.map(({ value, label, detail }) => (
                        <Surface key={value} variant={value} padding="compact">
                            <p className="font-body mb-dds-xs">{label}</p>
                            <p className="font-support text-muted">{detail}</p>
                        </Surface>
                    ))}
                </div>
            </div>
            <div className="dds-guide-group">
                <SectionHeading title="Status text" variant="subsection" />
                <div className="dds-example-actions">
                    <Badge>In progress</Badge>
                    <Badge tone="accent">Under review</Badge>
                    <Badge tone="success">Complete</Badge>
                </div>
            </div>
            <div className="dds-guide-group">
                <SectionHeading title="Expandable details" variant="subsection" />
                <div className="dds-specimen-stack font-body">
                    <Disclosure label="Research methods">
                        <p>Methods and evaluation notes can sit below a short project description.</p>
                    </Disclosure>
                    <Disclosure label="Project details" variant="plain" open>
                        <p>Use Enter or Space on the heading to show or hide these details.</p>
                    </Disclosure>
                </div>
            </div>
        </>
    );
}
