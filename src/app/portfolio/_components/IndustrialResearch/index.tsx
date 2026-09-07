import Image from "next/image";
import { industrialResearch } from "../../_data/industrial-research";

export default function IndustrialResearch() {
    return (
        <div className="portfolio-research-list">
            {industrialResearch.map(({ title, description, images }) => (
                <article key={title}>
                    <h4 className="font-body portfolio-role-title">{title}</h4>
                    <p className="font-support text-muted">{description}</p>
                    {images.map((image) => (
                        <a key={image.src} href={image.src} target="_blank" rel="noopener noreferrer"
                            className="portfolio-research-image" aria-label={`${image.alt}, view full image`}>
                            <Image {...image} alt={image.alt}
                                sizes="(max-width: 720px) calc(100vw - 112px), 608px" />
                        </a>
                    ))}
                </article>
            ))}
        </div>
    );
}
