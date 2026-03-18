import * as motion from "motion/react-client";
import type { ContentDoc } from "./types";
import type { Variants } from "motion";
import ContentBlock from "./_components/ContentBlock";
import BlockRenderer from "./BlockRenderer";

export type { ContentDoc, Block, SectionNode } from "./types";

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1,
        },
    },
};

export function ContentRenderer({ doc }: { doc: ContentDoc }) {
    return (
        <ContentBlock
            widthClassName={doc.widthClassName}
            gapClassName={doc.gapClassName}
        >
            {doc.blocks.map((block, i) => (
                <motion.div
                    key={i}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <BlockRenderer block={block} />
                </motion.div>
            ))}
        </ContentBlock>
    );
}
