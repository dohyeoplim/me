import NextImage from "next/image";

type Props = {
    url: string;
    alt?: string;
};

export default function Image({ url, alt }: Props) {
    if (!url) return null;
    return (
        <NextImage
            src={url}
            alt={alt ?? ""}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full rounded-md"
        />
    );
}
