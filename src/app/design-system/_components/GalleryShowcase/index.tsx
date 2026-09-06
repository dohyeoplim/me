import Carousel from "@/app/components/DDS/Carousel";
import DetailDialog from "@/app/components/DDS/DetailDialog";
import Illustration from "@/app/components/DDS/Illustration";
import { projectScenes } from "@/app/portfolio/_data/project-scenes";

export default function GalleryShowcase() {
    return (
        <Carousel label="Project graphics">
            {Object.values(projectScenes).map((scene) => (
                <div key={scene.label} className="ds-panel p-dds-lg">
                    <Illustration scene={scene} />
                    <DetailDialog title={scene.label} label="View details">
                        <p>Browse the collection, then inspect one item without leaving the page.</p>
                    </DetailDialog>
                </div>
            ))}
        </Carousel>
    );
}
