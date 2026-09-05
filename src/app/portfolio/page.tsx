import type { Metadata } from "next";
import SlideTransition from "@/app/components/SlideTransition";
import ProfileChat from "./_components/ProfileChat";
import ChapterNav from "./_components/ChapterNav";
import Research from "./_components/Research";
import Projects from "./_components/Projects";
import Background from "./_components/Background";
import "./portfolio.css";
import "../styles/dds-chat.css";
import "../styles/dds-answer-cards.css";

export const metadata: Metadata = {
    title: "Portfolio, Dohyeop Lim",
    description: "Research in document understanding and structured identifier recognition, and applied AI projects.",
};

export default function PortfolioPage() {
    return (
        <SlideTransition>
            <main id="main-content" className="portfolio-page">
                <ProfileChat />
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
