import Image from "next/image";
import * as motion from "motion/react-client";
import type { IntroDoc } from "@/app/lib/content/schema";

type Props = {
    image: IntroDoc["image"];
    className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Profile({ image, className }: Props) {
    return (
        <motion.figure
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.12 }}
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
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, 175px"
                />
            </div>

            <figcaption className="flex justify-between mt-1.5">
                <span>{image.captionBottomLeft}</span>
                <span>{image.captionBottomRight}</span>
            </figcaption>
        </motion.figure>
    );
}
