import Carousel from "@/app/components/DDS/Carousel";
import DetailDialog from "@/app/components/DDS/DetailDialog";

const examples = ["Image preview", "Content preview", "Detail preview"];

export default function GalleryShowcase() {
    return (
        <Carousel label="Gallery examples">
            {examples.map((title) => (
                <div key={title} className="ds-panel p-dds-lg dds-gallery-example">
                    <div className="dds-gallery-placeholder" aria-hidden="true">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 0L100 100M100 0L0 100" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>
                    <DetailDialog title={title} label="View details">
                        <p>Browse the collection, then inspect one item without leaving the page.</p>
                    </DetailDialog>
                </div>
            ))}
        </Carousel>
    );
}
