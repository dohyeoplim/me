import type { Metadata } from "next";
import SlideTransition from "@/app/components/SlideTransition";
import PortfolioHero from "./_components/PortfolioHero";
import ChapterNav from "./_components/ChapterNav";
import Research from "./_components/Research";
import Projects from "./_components/Projects";
import Background from "./_components/Background";
import "./portfolio.css";

export const metadata: Metadata = {
    title: "Portfolio, Dohyeop Lim",
    description: "Research in document understanding and structured identifier recognition, and applied AI projects.",
};

export default function PortfolioPage() {
    return (
        <SlideTransition>
            <main id="main-content" className="mx-auto w-full max-w-4xl px-dds-lg pb-dds-4xl">
                <PortfolioHero />
                <ChapterNav />
                <Research />
                <Projects />
                <Background />
            </main>
        </SlideTransition>
    );
}
