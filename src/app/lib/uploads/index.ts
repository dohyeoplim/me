export const imageUploadTypes = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];
export const imageUploadLimit = 10 * 1024 * 1024;

export function imageUploadError(file: { type: string; size: number }) {
    if (!imageUploadTypes.includes(file.type)) return "Choose a PNG, JPEG, WebP, GIF, or AVIF image.";
    if (file.size > imageUploadLimit) return "Choose an image smaller than 10 MB.";
    return null;
}
