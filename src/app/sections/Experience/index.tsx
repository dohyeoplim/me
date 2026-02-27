import SectionWithContent from "@/app/components/SectionWithContent";
import { loadContentDoc } from "@/app/lib/contentLoader";

export default async function Experience() {
    const doc = await loadContentDoc("home/experience.json");

    return <SectionWithContent doc={doc} />;
}
