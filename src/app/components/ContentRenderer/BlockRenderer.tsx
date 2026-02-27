import type { Block } from "./types";
import { textWithBreaks } from "./utils";
import TextOnly from "./_components/TextOnly";
import Divider from "./_components/Divider";
import Section from "./_components/Section";
import Item from "./_components/Item";
import Enumerate from "./_components/Enumerate";
import Project from "./_components/Project";
import SectionNodeRenderer from "./SectionNodeRenderer";

type Props = {
    block: Block;
};

export default function BlockRenderer({ block }: Props) {
    switch (block.type) {
        case "text":
            return <TextOnly>{textWithBreaks(block.text)}</TextOnly>;

        case "divider":
            return <Divider />;

        case "section":
            return (
                <Section label={block.label}>
                    {block.content.map((node, i) => (
                        <SectionNodeRenderer key={i} node={node} />
                    ))}
                </Section>
            );

        case "item":
            return (
                <Item
                    title={block.title}
                    subtitle={block.subtitle}
                    meta={block.meta}
                />
            );

        case "enumerate":
            return <Enumerate items={block.items} />;

        case "project":
            return (
                <Project
                    name={block.name}
                    year={block.year}
                    month={block.month}
                    tagline={block.tagline}
                    description={block.description}
                    meta={block.meta}
                />
            );

        default:
            return null;
    }
}
