import type { Block } from "./types";
import { textWithBreaks } from "./utils";
import StyledBlock from "./StyledBlock";
import TextOnly from "./_components/TextOnly";
import Heading from "./_components/Heading";
import Image from "./_components/Image";
import Divider from "./_components/Divider";
import Spacer from "./_components/Spacer";
import Section from "./_components/Section";
import Item from "./_components/Item";
import Enumerate from "./_components/Enumerate";
import Project from "./_components/Project";
import SectionNodeRenderer from "./SectionNodeRenderer";

type Props = {
    block: Block;
};

function inner(block: Block) {
    switch (block.type) {
        case "text":
            return (
                <TextOnly style={block.style}>
                    {textWithBreaks(block.text)}
                </TextOnly>
            );

        case "heading":
            return (
                <Heading style={block.style}>
                    {textWithBreaks(block.text)}
                </Heading>
            );

        case "image":
            return <Image url={block.url} alt={block.alt} />;

        case "divider":
            return <Divider />;

        case "spacer":
            return <Spacer size={block.size} />;

        case "section":
            return (
                <Section
                    label={block.label}
                    labelStyle={block.labelStyle}
                    gapClassName={block.gapClassName}
                >
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

export default function BlockRenderer({ block }: Props) {
    if (block.type === "text" || block.type === "heading") return inner(block);
    return <StyledBlock style={block.style}>{inner(block)}</StyledBlock>;
}
