"use client";

import { useState } from "react";
import NextImage from "next/image";
import { upload } from "@vercel/blob/client";
import { imageUploadError, imageUploadTypes } from "@/app/lib/uploads";
import { TextInput } from "../Field";

type Props = {
    url: string;
    alt: string;
    onChange: (patch: { url?: string; alt?: string }) => void;
    previewClassName?: string;
};

export default function ImageField({
    url,
    alt,
    onChange,
    previewClassName = "h-auto w-full",
}: Props) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validationError = imageUploadError(file);
        setError(validationError);
        if (validationError) return;
        setUploading(true);
        try {
            const blob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/blob/upload",
            });
            onChange({ url: blob.url });
        } catch {
            setError("The image could not be uploaded. Try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {url ? (
                <NextImage
                    src={url}
                    alt={alt}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={`rounded-md border border-grey-200 ${previewClassName}`}
                />
            ) : null}
            <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-grey-300 py-3 font-body04-light text-grey-500 hover:border-grey-400">
                <input
                    type="file"
                    accept={imageUploadTypes.join(",")}
                    disabled={uploading}
                    onChange={onFile}
                    className="hidden"
                />
                {uploading
                    ? "Uploading…"
                    : url
                      ? "Replace image"
                      : "Upload image"}
            </label>
            {error && <p className="font-support text-ink" role="alert">{error}</p>}
            <TextInput
                label="alt"
                value={alt}
                onChange={(v) => onChange({ alt: v })}
            />
        </div>
    );
}
