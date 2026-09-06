import SectionNavigation from "@/app/components/DDS/SectionNavigation";
import { chapters } from "../../_data/navigation";

export default function ChapterNav() {
    return <SectionNavigation sections={chapters} label="Portfolio sections" />;
}
