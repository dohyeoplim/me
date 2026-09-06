"use client";

import { useEffect, useRef, useState } from "react";
import { profileChatAnswerSchema } from "@/app/lib/profile-chat/answer-content";
import { useProfileChatContext } from "../Context";

type Availability = "checking" | "available" | "unavailable";

export const chatCopy = {
    label: "Ask anything about me",
    followUp: "Ask a follow-up",
    placeholder: "Ask a question, or choose one below",
    unavailable: "Questions are unavailable right now. You can still browse my portfolio.",
    pending: "Looking through my profile…",
    canceled: "Request canceled.",
    error: "The answer could not be loaded. Please try again.",
    limited: "There have been too many requests. Please try again later.",
};

export default function useProfileConversation() {
    const { exchanges, setExchanges } = useProfileChatContext();
    const [question, setQuestion] = useState("");
    const request = useRef<{ controller: AbortController; question: string } | null>(null);
    const [availability, setAvailability] = useState<Availability>("checking");
    const [availabilityAttempt, setAvailabilityAttempt] = useState(0);
    const [pendingQuestion, setPendingQuestion] = useState("");
    const [pendingContext, setPendingContext] = useState<string[]>([]);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function checkAvailability() {
            try {
                const response = await fetch("/api/profile-chat", { signal: controller.signal, cache: "no-store" });
                const result: unknown = response.ok ? await response.json() : null;
                const ready =
                    result && typeof result === "object" && "available" in result && result.available === true;
                if (!controller.signal.aborted) setAvailability(ready ? "available" : "unavailable");
            } catch {
                if (!controller.signal.aborted) setAvailability("unavailable");
            }
        }

        void checkAvailability();
        return () => controller.abort();
    }, [availabilityAttempt]);

    useEffect(() => () => {
        const active = request.current;
        if (!active) return;
        active.controller.abort();
        request.current = null;
    }, [setQuestion]);

    async function ask(value: string, selectedSourceIds?: string[]) {
        const nextQuestion = value.trim();
        if (request.current || !nextQuestion || nextQuestion.length > 600) return;

        const contextSourceIds = selectedSourceIds ?? exchanges.at(-1)?.sources.map(({ id }) => id).slice(0, 6) ?? [];
        const controller = new AbortController();
        request.current = { controller, question: nextQuestion };
        setPending(true);
        setPendingQuestion(nextQuestion);
        setPendingContext(contextSourceIds);
        setQuestion("");
        setError("");
        setNotice("");

        try {
            const history = exchanges.slice(-3).flatMap((exchange) => [
                { role: "user", content: exchange.question.slice(0, 2000) },
                {
                    role: "assistant",
                    content: JSON.stringify({
                        answer: exchange.answer,
                        blocks: exchange.blocks,
                        repositories: exchange.repositories.map(({ fullName }) => fullName),
                    }).slice(0, 2000),
                },
            ]);
            const shownCardIds = [...new Set(exchanges.flatMap(({ cards }) => cards.map(({ id }) => id)))];
            const response = await fetch("/api/profile-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: nextQuestion, history, shownCardIds, contextSourceIds }),
                signal: controller.signal,
            });

            if (!response.ok) {
                if (response.status === 503) {
                    setAvailability("unavailable");
                    throw new Error(chatCopy.unavailable);
                }
                throw new Error(response.status === 429 ? chatCopy.limited : chatCopy.error);
            }

            const result = profileChatAnswerSchema.safeParse(await response.json());
            if (!result.success) throw new Error(chatCopy.error);
            if (controller.signal.aborted) return;

            setAvailability("available");
            setExchanges((previous) => [
                ...previous,
                { id: crypto.randomUUID(), question: nextQuestion, ...result.data },
            ]);
            setPendingQuestion("");
        } catch (reason) {
            if (controller.signal.aborted) return;
            const message = reason instanceof Error ? reason.message : "";
            setError([chatCopy.limited, chatCopy.unavailable].includes(message) ? message : chatCopy.error);
        } finally {
            if (request.current?.controller === controller) {
                request.current = null;
                setPending(false);
            }
        }
    }

    function cancel() {
        request.current?.controller.abort();
        request.current = null;
        setPending(false);
        setQuestion(pendingQuestion);
        setPendingQuestion("");
        setError("");
        setNotice(chatCopy.canceled);
    }

    function clearConversation() {
        if (request.current) return;
        setExchanges([]);
        setQuestion("");
        setPendingQuestion("");
        setError("");
        setNotice("");
    }

    function retryAvailability() {
        setAvailability("checking");
        setError("");
        setAvailabilityAttempt((attempt) => attempt + 1);
    }

    return {
        exchanges, question, setQuestion, pending, pendingQuestion, pendingContext, availability,
        error, notice, ask, cancel, clearConversation, retryAvailability,
    };
}
