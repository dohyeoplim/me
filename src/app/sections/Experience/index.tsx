import SectionWithContent from "@/app/components/SectionWithContent";
import { loadEntry } from "@/app/lib/contentLoader";

export default async function Experience() {
    const doc = await loadEntry("home_section", "experience");

    return <SectionWithContent doc={doc} />;
}
