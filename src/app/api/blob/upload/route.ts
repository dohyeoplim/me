import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";

export async function POST(request: Request): Promise<Response> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const result = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                const session = await auth();
                if (!session?.user) throw new Error("Unauthorized");
                return {
                    allowedContentTypes: [
                        "image/png",
                        "image/jpeg",
                        "image/webp",
                        "image/gif",
                        "image/avif",
                        "image/svg+xml",
                    ],
                    addRandomSuffix: true,
                };
            },
            onUploadCompleted: async () => {},
        });
        return Response.json(result);
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
