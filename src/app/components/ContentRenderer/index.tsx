import * as React from "react";
import { ContentBlock } from "./_components/Blocks";
import { textWithBreaks } from "./utils";
import type { ContentDoc, Block, SectionNode } from "./types";

function renderSectionNode(node: SectionNode, key: React.Key) {
    switch (node.type) {
        case "item":
            return (
                <ContentBlock.Item
                    key={key}
                    title={node.title}
                    subtitle={node.subtitle}
                    meta={node.meta}
                />
            );

        case "enumerate":
            return (
                <div key={key} className="flex flex-col gap-2">
                    {node.items.map((l, i) => (
                        <div
                            key={i}
                            className="font-body03-regular text-grey-800"
                        >
                            {l}
                        </div>
                    ))}
                </div>
            );

        default:
            return null;
    }
}

function renderBlock(block: Block, key: React.Key) {
    switch (block.type) {
        case "text":
            return (
                <ContentBlock.TextOnly key={key}>
                    {textWithBreaks(block.text)}
                </ContentBlock.TextOnly>
            );

        case "divider":
            return <ContentBlock.Divider key={key} />;

        case "section":
            return (
                <ContentBlock.Section key={key} label={block.label}>
                    {block.content.map((n, i) =>
                        renderSectionNode(n, `${String(key)}-n-${i}`),
                    )}
                </ContentBlock.Section>
            );

        case "item":
            return (
                <ContentBlock.Item
                    key={key}
                    title={block.title}
                    subtitle={block.subtitle}
                    meta={block.meta}
                />
            );

        case "enumerate":
            return (
                <div key={key} className="flex flex-col gap-2">
                    {block.items.map((l, i) => (
                        <div
                            key={i}
                            className="font-body03-regular text-grey-800"
                        >
                            {l}
                        </div>
                    ))}
                </div>
            );

        case "project":
            return (
                <div key={key} className="self-stretch flex flex-col gap-3">
                    <div className="self-stretch flex flex-col gap-1">
                        <ContentBlock.KVRow
                            left={block.name}
                            right={
                                <>
                                    {block.year ? (
                                        <div className="font-body05-light text-grey-400 mt-px">
                                            {block.year}
                                        </div>
                                    ) : null}
                                    {block.month ? (
                                        <div className="font-body01-regular text-grey-500 -mt-1">
                                            {block.month}
                                        </div>
                                    ) : null}
                                </>
                            }
                        />
                        {block.tagline ? (
                            <div className="font-body02-regular text-grey-800">
                                {block.tagline}
                            </div>
                        ) : null}
                    </div>

                    {block.description ? (
                        <div className="self-stretch font-body03-light text-grey-600">
                            {block.description}
                        </div>
                    ) : null}

                    {block.meta ? (
                        <ContentBlock.TextOnly className="mt-1 font-body04-light text-grey-500!">
                            {textWithBreaks(block.meta)}
                        </ContentBlock.TextOnly>
                    ) : null}
                </div>
            );

        default:
            return null;
    }
}

export function ContentRenderer({ doc }: { doc: ContentDoc }) {
    return (
        <ContentBlock
            widthClassName={doc.widthClassName}
            gapClassName={doc.gapClassName}
        >
            {doc.blocks.map((b, i) => renderBlock(b, i))}
        </ContentBlock>
    );
}
