import SectionWithContent from "@/app/components/SectionWithContent";
import { loadEntry } from "@/app/lib/contentLoader";

export default async function Projects() {
    const doc = await loadEntry("home_section", "projects");

    return <SectionWithContent doc={doc} />;
}
