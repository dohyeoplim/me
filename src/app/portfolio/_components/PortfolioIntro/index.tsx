import Image from "next/image";
import LinkButton from "@/app/components/LinkButton";
import { hero, portfolioIntro } from "../../_data/hero";

export default function PortfolioIntro() {
    return (
        <header className="dds-container portfolio-page-heading">
            <div className="portfolio-identity">
                <h1 className="font-page-title">{hero.name}</h1>
                <p className="font-work-title">{hero.title}</p>
                <p className="portfolio-introduction">{portfolioIntro.description}</p>
            </div>
            <div className="portfolio-portrait">
                <Image src={hero.image.src} alt={hero.image.alt} width={176} height={176} priority />
            </div>
            <div className="portfolio-intro-links">
                {portfolioIntro.links.map(({ label, href }) => (
                    <LinkButton key={label} href={href} label={label} icon="external" />
                ))}
            </div>
        </header>
    );
}
