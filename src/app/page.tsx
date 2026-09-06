import type { Metadata } from "next";
import ProfileChat from "./components/ProfileChat";
import SlideTransition from "./components/SlideTransition";
import "./styles/dds-chat.css";
import "./styles/dds-answer-cards.css";
import "./styles/dds-answer-blocks.css";
import "./portfolio/portfolio.css";

export const metadata: Metadata = {
    title: "Dohyeop Lim",
    description: "Explore Dohyeop Lim's research, projects, and experience.",
};

export default function Home() {
    return (
        <SlideTransition>
            <main id="main-content">
                <ProfileChat />
            </main>
        </SlideTransition>
    );
}
