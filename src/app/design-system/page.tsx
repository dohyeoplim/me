import type { Metadata } from "next";
import SlideTransition from "@/app/components/SlideTransition";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import ButtonShowcase from "./_components/ButtonShowcase";
import ComponentShowcase from "./_components/ComponentShowcase";
import FoundationsShowcase from "./_components/FoundationsShowcase";
import MotionShowcase from "./_components/MotionShowcase";
import LoadingShowcase from "./_components/LoadingShowcase";
import GalleryShowcase from "./_components/GalleryShowcase";
import { designSystem, navigation } from "./data";

export const metadata: Metadata = {
    title: `${designSystem.name}, ${designSystem.fullName}`,
    description: designSystem.description,
};

export default function DesignSystemPage() {
    return (
        <SlideTransition>
            <main id="main-content" className="dds-container dds-guide-page pb-dds-4xl">
                <header className="dds-guide-header">
                    <h1 className="font-page-title">{designSystem.name}</h1>
                    <p className="font-body">{designSystem.fullName}</p>
                    <p className="font-body text-muted">Type, color, spacing, and components used on this website.</p>
                    <nav aria-label="Design system sections" className="dds-guide-nav font-support">
                        {navigation.map(({ id, label }) => (
                            <a key={id} href={`#${id}`}>{label}</a>
                        ))}
                    </nav>
                </header>
                <section id="foundations" className="ds-section border-t border-line">
                    <SectionHeading title="Foundations" />
                    <FoundationsShowcase />
                </section>
                <section id="buttons" className="ds-section border-t border-line">
                    <SectionHeading title="Buttons" />
                    <ButtonShowcase />
                </section>
                <section id="components" className="ds-section border-t border-line">
                    <SectionHeading title="Components" />
                    <ComponentShowcase />
                    <SectionHeading title="Gallery and details" variant="subsection" />
                    <GalleryShowcase />
                </section>
                <section id="motion" className="ds-section border-t border-line">
                    <SectionHeading title="Motion" description="A brief entrance, with reduced motion support." />
                    <MotionShowcase />
                </section>
                <section id="loading" className="ds-section border-t border-line">
                    <SectionHeading
                        title="Loading states"
                        description="Keep the layout in place while content loads."
                    />
                    <LoadingShowcase />
                </section>
            </main>
        </SlideTransition>
    );
}
