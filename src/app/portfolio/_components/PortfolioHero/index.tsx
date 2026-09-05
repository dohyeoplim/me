import Image from "next/image";
import { hero } from "../../_data/hero";

export default function PortfolioHero() {
    return (
        <section className="portfolio-intro">
            <div className="portfolio-intro-heading">
                <h1 className="font-page-title">{hero.name}</h1>
                <p className="portfolio-role">{hero.title}</p>
            </div>
            <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={108}
                height={142}
                priority
                className="portfolio-portrait"
            />
            <p className="font-body portfolio-intro-bio">{hero.bio}</p>
        </section>
    );
}
