import Disclosure from "@/app/components/DDS/Disclosure";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import type { ProfileAnswerBlock } from "@/app/lib/profile-chat/types";

type Props = {
    blocks: ProfileAnswerBlock[];
};

function BlockContent({ block }: { block: ProfileAnswerBlock }) {
    switch (block.type) {
        case "facts":
            return (
                <dl className="dds-answer-detail-facts">
                    {block.items.map(({ label, value }, index) => (
                        <div key={`${label}-${index}`}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            );
        case "steps":
            return (
                <ol className="dds-answer-steps" aria-label={block.title}>
                    {block.items.map(({ title, description }, index) => (
                        <li key={`${title}-${index}`}>
                            <Disclosure label={title} variant="plain" open={index === 0}>
                                <p>{description}</p>
                            </Disclosure>
                        </li>
                    ))}
                </ol>
            );
        case "comparison":
            return (
                <div className="dds-answer-comparison" tabIndex={0} role="region" aria-label={block.title}>
                    <table>
                        <caption className="sr-only">{block.title}</caption>
                        <thead>
                            <tr>
                                <th scope="col"><span className="sr-only">Topic</span></th>
                                {block.columns.map((column, index) => (
                                    <th key={`${column}-${index}`} scope="col">{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map(({ label, values }, index) => (
                                <tr key={`${label}-${index}`}>
                                    <th scope="row">{label}</th>
                                    {values.map((value, valueIndex) => <td key={valueIndex}>{value}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case "timeline":
            return (
                <ol className="dds-answer-timeline">
                    {block.items.map(({ date, title, description }, index) => (
                        <li key={`${title}-${index}`}>
                            <p className="dds-answer-date">{date}</p>
                            <div>
                                <h4 className="font-body">{title}</h4>
                                <p>{description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            );
        default:
            return null;
    }
}

export default function AnswerBlocks({ blocks }: Props) {
    if (!blocks.length) return null;

    return (
        <div className="dds-answer-blocks">
            {blocks.map((block, index) => (
                <section className="dds-answer-block" key={`${block.type}-${index}`} aria-label={block.title}>
                    <SectionHeading title={block.title} variant="subsection" as="h3" />
                    <BlockContent block={block} />
                </section>
            ))}
        </div>
    );
}
