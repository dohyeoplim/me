import Image from "next/image";

type Props = {
    className?: string;
};

export default function Profile({ className }: Props) {
    return (
        <figure
            className={`${className || ""} font-caption03-regular text-grey-500 uppercase w-full max-w-43.75 select-none pointer-events-none`}
        >
            <figcaption className="flex justify-between">
                <span>Portrait</span>
                <span>2026</span>
            </figcaption>

            <div className="relative w-full aspect-175/230 mt-1.5 bg-[#F5F5F7]">
                <Image
                    src="/profile.png"
                    alt="Dohyeop Lim's profile image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, 175px"
                />
            </div>

            <figcaption className="flex justify-between mt-1.5">
                <span>Fig. 01</span>
                <span>Seoul, KR</span>
            </figcaption>
        </figure>
    );
}
