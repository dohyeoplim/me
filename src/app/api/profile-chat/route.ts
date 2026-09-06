import { answerQuestion } from "@/app/lib/profile-chat/answer";
import { consumeChatBudget, isChatConfigured } from "@/app/lib/profile-chat/rate-limit";
import { ChatError, readQuestion, validateOrigin } from "@/app/lib/profile-chat/validation";

export const runtime = "nodejs";
export const maxDuration = 30;

const headers = { "Cache-Control": "no-store" };

export function GET() {
    return Response.json({ available: isChatConfigured() }, { headers });
}

export async function POST(request: Request) {
    try {
        validateOrigin(request);
        const question = await readQuestion(request);

        if (!isChatConfigured()) {
            return Response.json(
                { error: "Chat is not available yet.", code: "unavailable" },
                {
                    status: 503,
                    headers,
                },
            );
        }

        const budget = await consumeChatBudget(request);
        if (!budget.allowed) {
            return Response.json(
                { error: "Please try again later.", code: "rate_limited" },
                {
                    status: 429,
                    headers: { ...headers, "Retry-After": String(Math.max(1, budget.retryAfter)) },
                },
            );
        }

        return Response.json(await answerQuestion(question, request.signal), { headers });
    } catch (error) {
        if (error instanceof ChatError) {
            return Response.json({ error: error.message, code: error.code }, { status: error.status, headers });
        }

        if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) {
            return Response.json(
                { error: "The request took too long. Please try again.", code: "timeout" },
                {
                    status: 504,
                    headers,
                },
            );
        }

        return Response.json(
            { error: "Chat is temporarily unavailable.", code: "unavailable" },
            {
                status: 503,
                headers,
            },
        );
    }
}
