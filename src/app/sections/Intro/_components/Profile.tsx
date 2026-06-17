import Image from "next/image";
import type { IntroDoc } from "@/app/lib/content/schema";

type Props = {
    image: IntroDoc["image"];
    className?: string;
};

export default function Profile({ image, className }: Props) {
    return (
        <figure
            className={`${className || ""} font-caption03-regular text-grey-500 uppercase w-full max-w-43.75 select-none pointer-events-none`}
        >
            <figcaption className="flex justify-between">
                <span>{image.captionTopLeft}</span>
                <span>{image.captionTopRight}</span>
            </figcaption>

            <div className="relative w-full aspect-175/230 mt-1.5 bg-grey-100">
                <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, 175px"
                />
            </div>

            <figcaption className="flex justify-between mt-1.5">
                <span>{image.captionBottomLeft}</span>
                <span>{image.captionBottomRight}</span>
            </figcaption>
        </figure>
    );
}
