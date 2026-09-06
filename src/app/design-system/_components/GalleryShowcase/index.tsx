import Carousel from "@/app/components/DDS/Carousel";
import GalleryCard from "@/app/components/DDS/GalleryCard";

const examples = ["Image preview", "Content preview", "Detail preview"];

export default function GalleryShowcase() {
    return (
        <Carousel label="Gallery examples" variant="full-bleed">
            {examples.map((title) => (
                <GalleryCard key={title} title={title} description="A short description of the selected item."
                    detailsLabel="View details" mediaLabel="Image placeholder" media={
                    <div className="dds-gallery-placeholder" aria-hidden="true">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 0L100 100M100 0L0 100" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>}>
                        <p>Browse the collection, then inspect one item without leaving the page.</p>
                </GalleryCard>
            ))}
        </Carousel>
    );
}
