"use client";

import type { ContentDoc } from "@/app/lib/content/schema";
import ContentBlock from "@/app/components/ContentRenderer/_components/ContentBlock";
import BlockRenderer from "@/app/components/ContentRenderer/BlockRenderer";

type Props = {
    doc: ContentDoc;
};

export default function Preview({ doc }: Props) {
    return (
        <div className="rounded-lg border border-grey-200 bg-grey-50 p-6">
            {doc.sectionTitle && (
                <div className="mb-6">
                    <div className="font-caption02-light uppercase text-grey-500">
                        {doc.sectionTitle.subtitle}
                    </div>
                    <div className="font-head01-medium text-grey-900">
                        {doc.sectionTitle.title}
                    </div>
                </div>
            )}
            <ContentBlock
                widthClassName={doc.widthClassName}
                gapClassName={doc.gapClassName}
            >
                {doc.blocks.map((block) => (
                    <BlockRenderer key={block.id} block={block} />
                ))}
            </ContentBlock>
        </div>
    );
}
