import Image from "next/image";
import { hero } from "../../_data/hero";

export default function PortfolioHero() {
    return (
        <section className="portfolio-intro">
            <div>
                <h1 className="font-display-light mb-dds-xl">{hero.name}</h1>
                <p className="font-feature-light mb-dds-lg">{hero.title}</p>
                <p className="font-body02-light max-w-lg text-muted">{hero.bio}</p>
            </div>
            <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={132}
                height={174}
                priority
                className="portfolio-portrait"
            />
        </section>
    );
}
