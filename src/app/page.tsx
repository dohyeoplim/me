import Intro from "./sections/Intro";
import SectionWithContent from "@/app/components/SectionWithContent";
import { loadEntriesByType } from "@/app/lib/contentLoader";

export const dynamic = "force-dynamic";

export default async function Home() {
    const sections = await loadEntriesByType("home_section", true);

    return (
        <div className="w-full max-w-4xl mx-auto md:pt-40 pb-30 px-6">
            <main className="flex flex-col items-center gap-30">
                <Intro />
                {sections.map((section) => (
                    <SectionWithContent key={section.id} doc={section.doc} />
                ))}
            </main>
        </div>
    );
}
