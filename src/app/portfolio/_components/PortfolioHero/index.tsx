import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { hero } from "../../_data/hero";

export default function PortfolioHero() {
    return (
        <section className="flex min-h-[min(850px,100svh)] flex-col justify-center gap-12 pb-16 pt-32 md:pt-44">
            <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                <p className="ds-label">{hero.period}</p>
            </div>
            <h1 className="font-display-light max-w-3xl">
                {hero.title}
                <br />
                <span className="text-grey-400">{hero.subtitle}</span>
            </h1>
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                <div className="max-w-lg">
                    <p className="font-body01-regular mb-3">{hero.name}</p>
                    <p className="font-body02-light text-grey-600">{hero.bio}</p>
                </div>
                <Image
                    src={hero.image.src}
                    alt={hero.image.alt}
                    width={88}
                    height={112}
                    priority
                    className="h-28 w-22 rounded-sm object-cover grayscale"
                />
            </div>
            <a href="#research" className="ds-label flex w-fit items-center gap-3 py-2 hover:text-grey-900">
                {hero.action} <ArrowDown size={16} aria-hidden="true" />
            </a>
        </section>
    );
}
