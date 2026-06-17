import SectionWithContent from "@/app/components/SectionWithContent";
import { loadEntry } from "@/app/lib/contentLoader";

export default async function About() {
    const doc = await loadEntry("home_section", "about");

    return <SectionWithContent doc={doc} />;
}
