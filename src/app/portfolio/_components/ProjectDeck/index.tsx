import Image from "next/image";
import type { Project } from "../../_data/projects";

const imageBase = "https://ctylphpsl8g3drjb.public.blob.vercel-storage.com/portfolio";

export default function ProjectDeck({ name, deck }: Pick<Project, "name" | "deck">) {
    if (!deck) return null;

    return (
        <div className="portfolio-project-deck">
            {Array.from({ length: deck.count }, (_, index) => (
                <Image key={index} src={`${imageBase}/${deck.prefix}_${index + 1}.png`}
                    alt={`${name}, slide ${index + 1} of ${deck.count}`} width={1920} height={1080}
                    sizes="(max-width: 720px) calc(100vw - 112px), 608px" />
            ))}
        </div>
    );
}
