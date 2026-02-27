import * as motion from "motion/react-client";
import { ContentRenderer } from "@/app/components/ContentRenderer";
import SectionTitle from "@/app/components/SectionTitle";
import type { ContentDoc } from "@/app/components/ContentRenderer/types";
import { cn } from "@/app/lib/utils";

type SectionWithContentProps = {
    doc: ContentDoc;
    className?: string;
};

export default function SectionWithContent({
    doc,
    className,
}: SectionWithContentProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={cn(
                "relative w-full flex flex-col md:flex-row justify-between gap-12 md:gap-0",
                className,
            )}
        >
            {doc.sectionTitle && (
                <div className="md:w-1/4">
                    <SectionTitle
                        title={doc.sectionTitle.title}
                        subtitle={doc.sectionTitle.subtitle}
                    />
                </div>
            )}
            <ContentRenderer doc={doc} />
        </motion.section>
    );
}
