import type { Metadata } from "next";
import SlideTransition from "@/app/components/SlideTransition";
import ChapterNav from "./_components/ChapterNav";
import Research from "./_components/Research";
import Projects from "./_components/Projects";
import Background from "./_components/Background";
import "./portfolio.css";

export const metadata: Metadata = {
    title: "Portfolio, Dohyeop Lim",
    description: "Research and projects in computer vision, speech recognition, multimodal models, and evaluation.",
};

export default function PortfolioPage() {
    return (
        <SlideTransition>
            <main id="main-content" className="portfolio-page">
                <div className="dds-container portfolio-page-heading">
                    <h1 className="font-page-title">Dohyeop Lim</h1>
                    <p className="font-body">
                        Research and projects in computer vision, speech recognition, multimodal models, and evaluation.
                    </p>
                </div>
                <ChapterNav />
                <div className="dds-container">
                    <Research />
                    <Projects />
                    <Background />
                </div>
            </main>
        </SlideTransition>
    );
}
