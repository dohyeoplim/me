import Image from "next/image";
import LinkButton from "@/app/components/LinkButton";
import { hero, portfolioIntro } from "../../_data/hero";

export default function PortfolioIntro() {
    return (
        <header className="dds-container portfolio-page-heading">
            <div className="portfolio-identity">
                <h1 className="font-page-title">{hero.name}</h1>
                <p className="font-work-title">{portfolioIntro.title}</p>
                <div className="portfolio-intro-links">
                    {portfolioIntro.links.map(({ label, href }) => (
                        <LinkButton key={label} href={href} label={label} icon="external" />
                    ))}
                </div>
            </div>
            <div className="portfolio-portrait">
                <Image
                    src={hero.image.src}
                    alt={hero.image.alt}
                    fill
                    sizes="(max-width: 571px) 80px, (max-width: 1257px) 14vw, 176px"
                    priority
                />
            </div>
        </header>
    );
}
