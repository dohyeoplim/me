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
            {doc.blocks.map((block) => (
                <div key={block.id}>
                    <BlockRenderer block={block} />
                </div>
            ))}
        </ContentBlock>
    );
}
