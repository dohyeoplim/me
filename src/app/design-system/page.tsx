import type { Metadata } from "next";
import SlideTransition from "@/app/components/SlideTransition";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import ButtonShowcase from "./_components/ButtonShowcase";
import ComponentShowcase from "./_components/ComponentShowcase";
import FoundationsShowcase from "./_components/FoundationsShowcase";
import LoadingShowcase from "./_components/LoadingShowcase";
import GalleryShowcase from "./_components/GalleryShowcase";
import GraphicsShowcase from "./_components/GraphicsShowcase";
import SectionNavigation from "@/app/components/DDS/SectionNavigation";
import { designSystem, navigation } from "./data";

export const metadata: Metadata = {
    title: "Design :: Dohyeop",
    description: designSystem.description,
};

export default function DesignSystemPage() {
    return (
        <SlideTransition>
            <main id="main-content" className="dds-container dds-guide-page pb-dds-4xl">
                <header className="dds-guide-header">
                    <h1 className="font-page-title">{designSystem.name}</h1>
                    <p className="font-body text-muted">{designSystem.fullName}</p>
                </header>
                <SectionNavigation sections={navigation} label="Design system sections" />
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
                    <div className="dds-guide-group">
                        <SectionHeading title="Gallery and details" variant="subsection" />
                        <GalleryShowcase />
                    </div>
                </section>
                <section id="graphics" className="ds-section border-t border-line">
                    <SectionHeading title="Graphics" />
                    <GraphicsShowcase />
                </section>
                <section id="loading" className="ds-section border-t border-line">
                    <SectionHeading
                        title="Loading states"
                    />
                    <LoadingShowcase />
                </section>
            </main>
        </SlideTransition>
    );
}
