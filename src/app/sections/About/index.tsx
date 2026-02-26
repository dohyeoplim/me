import { ContentRenderer } from "@/app/components/ContentRenderer";
import SectionTitle from "@/app/components/SectionTitle";
import { loadContentDoc } from "@/app/lib/contentLoader";

export default async function About() {
    const sidebar = await loadContentDoc("home.json");

    return (
        <div className="relative w-full flex justify-between">
            <SectionTitle subtitle="Background" title="About" />
            <ContentRenderer doc={sidebar} />
        </div>
    );
}
