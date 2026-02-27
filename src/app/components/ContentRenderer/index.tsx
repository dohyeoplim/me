import type { ContentDoc } from "./types";
import ContentBlock from "./_components/ContentBlock";
import BlockRenderer from "./BlockRenderer";

export type { ContentDoc, Block, SectionNode } from "./types";

export function ContentRenderer({ doc }: { doc: ContentDoc }) {
    return (
        <ContentBlock
            widthClassName={doc.widthClassName}
            gapClassName={doc.gapClassName}
        >
            {doc.blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} />
            ))}
        </ContentBlock>
    );
}
