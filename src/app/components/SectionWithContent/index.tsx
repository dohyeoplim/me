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
        <section
            className={cn("relative w-full flex justify-between", className)}
        >
            {doc.sectionTitle && (
                <SectionTitle
                    title={doc.sectionTitle.title}
                    subtitle={doc.sectionTitle.subtitle}
                />
            )}
            <ContentRenderer doc={doc} />
        </section>
    );
}
