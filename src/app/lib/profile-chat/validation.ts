import { z } from "zod";

export const maxBodyBytes = 48 * 1024;

const messageSchema = z
    .object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
    })
    .strict();

export const questionSchema = z
    .object({
        question: z.string().trim().min(1).max(600),
        history: z.array(messageSchema).max(6).default([]),
    })
    .strict();

export type ChatMessage = z.infer<typeof messageSchema>;
export type ChatQuestion = z.infer<typeof questionSchema>;

export class ChatError extends Error {
    readonly status: number;
    readonly code: string;

    constructor(message: string, status: number, code: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export function validateOrigin(request: Request) {
    const origin = request.headers.get("origin");
    const fetchSite = request.headers.get("sec-fetch-site");

    const invalidOrigin = origin && origin !== new URL(request.url).origin;
    const invalidSite = fetchSite && !["same-origin", "none"].includes(fetchSite);

    if (invalidOrigin || invalidSite) {
        throw new ChatError("Please use the chat on this website.", 403, "invalid_origin");
    }
}

export async function readQuestion(request: Request) {
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
        throw new ChatError("Send a JSON request.", 415, "invalid_content_type");
    }

    if (Number(request.headers.get("content-length")) > maxBodyBytes) {
        throw new ChatError("Your message is too long.", 413, "body_too_large");
    }

    const reader = request.body?.getReader();
    if (!reader) throw new ChatError("Enter a question.", 400, "invalid_question");

    const chunks: Uint8Array[] = [];
    let size = 0;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > maxBodyBytes) {
                await reader.cancel();
                throw new ChatError("Your message is too long.", 413, "body_too_large");
            }
            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }

    try {
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        const parsed = questionSchema.safeParse(body);
        if (parsed.success) return parsed.data;
    } catch {
        throw new ChatError("Send a valid JSON request.", 400, "invalid_json");
    }

    throw new ChatError("Use a question under 600 characters and a shorter conversation.", 400, "invalid_question");
}
