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
        </section>
    );
}
