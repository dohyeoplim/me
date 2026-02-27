import SectionWithContent from "@/app/components/SectionWithContent";
import { loadContentDoc } from "@/app/lib/contentLoader";

export default async function Projects() {
    const doc = await loadContentDoc("home/projects.json");

    return <SectionWithContent doc={doc} />;
}
