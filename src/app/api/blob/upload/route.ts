import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";
import { imageUploadLimit, imageUploadTypes } from "@/app/lib/uploads";

export async function POST(request: Request): Promise<Response> {
    try {
        const body = (await request.json()) as HandleUploadBody;
        const result = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                const session = await auth();
                if (session?.user?.admin !== true) throw new Error("Unauthorized");
                return {
                    allowedContentTypes: imageUploadTypes,
                    maximumSizeInBytes: imageUploadLimit,
                    addRandomSuffix: true,
                };
            },
            onUploadCompleted: async () => {},
        });
        return Response.json(result);
    } catch {
        return Response.json(
            { error: "The upload could not be authorized. Check the image and try again." },
            { status: 400 },
        );
    }
}
