"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, Square } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import IconButton from "@/app/components/DDS/IconButton";
import LinkButton from "@/app/components/LinkButton";
import {
    profileCardRegistry,
    type ProfileCardId,
    type ProfileChatAnswer,
    type ProfileSource,
} from "@/app/lib/profile-chat/types";
import { hero } from "../../_data/hero";
import ProfileChatCards from "../ProfileChatCards";

type Exchange = ProfileChatAnswer & { id: string; question: string };
type Availability = "checking" | "available" | "unavailable";

const copy = {
    label: "Ask anything about me",
    followUp: "Ask a follow-up",
    placeholder: "What would you like to know?",
    unavailable: "Questions are unavailable right now. You can still browse my portfolio.",
    pending: "Looking through my profile…",
    canceled: "Request canceled.",
    error: "The answer could not be loaded. Please try again.",
    limited: "There have been too many requests. Please try again later.",
    suggestions: ["What did you contribute to E-ACT?", "Which projects use speech recognition?"],
};

const transition = { duration: 0.24, ease: [0.2, 0, 0, 1] as const };

function sourceHref(value: string) {
    if (/^\/(?![\\/])/.test(value) || value.startsWith("#")) return value;

    try {
        const url = new URL(value);
        return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}

function readAnswer(value: unknown): ProfileChatAnswer | null {
    if (!value || typeof value !== "object" || !("answer" in value)) return null;
    if (typeof value.answer !== "string" || !value.answer.trim()) return null;

    const sources = "sources" in value && Array.isArray(value.sources) ? value.sources : [];
    const cards = "cards" in value && Array.isArray(value.cards) ? value.cards : [];

    return {
        answer: value.answer,
        sources: sources.filter(
            (source): source is ProfileSource =>
                source &&
                typeof source === "object" &&
                typeof source.id === "string" &&
                typeof source.title === "string" &&
                source.title.trim().length > 0 &&
                typeof source.url === "string" &&
                sourceHref(source.url) !== null,
        ),
        cards: cards.flatMap((card) => {
            if (!card || typeof card !== "object" || !Object.hasOwn(profileCardRegistry, card.id)) return [];
            const registered = profileCardRegistry[card.id as ProfileCardId];
            return card.type === registered.type ? [registered] : [];
        }),
    };
}

function AnswerSources({ sources }: { sources: ProfileSource[] }) {
    if (sources.length === 0) return null;

    return (
        <nav className="dds-chat-sources" aria-label="Sources for this answer">
            {sources.map((source) => {
                const href = sourceHref(source.url);
                const external = href?.startsWith("http");
                return (
                    <a
                        key={source.id}
                        href={href ?? undefined}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                    >
                        {source.title}
                    </a>
                );
            })}
        </nav>
    );
}

export default function ProfileChat() {
    const id = useId();
    const reducedMotion = useReducedMotion();
    const input = useRef<HTMLTextAreaElement>(null);
    const conversation = useRef<HTMLDivElement>(null);
    const latestQuestion = useRef<HTMLDivElement>(null);
    const request = useRef<AbortController | null>(null);
    const [availability, setAvailability] = useState<Availability>("checking");
    const [availabilityAttempt, setAvailabilityAttempt] = useState(0);
    const [question, setQuestion] = useState("");
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [pendingQuestion, setPendingQuestion] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const started = exchanges.length > 0 || pendingQuestion.length > 0;
    const movement = reducedMotion ? { duration: 0 } : transition;
    const status = pending
        ? copy.pending
        : error ||
          (availability === "unavailable" ? copy.unavailable : notice || "AI answers from public profile information.");

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

    useEffect(
        () => () => {
            request.current?.abort();
            request.current = null;
        },
        [],
    );

    useEffect(() => {
        if (!input.current) return;
        input.current.style.height = "auto";
        input.current.style.height = `${input.current.scrollHeight}px`;
    }, [question]);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const viewport = conversation.current;
            const latest = latestQuestion.current;
            if (!viewport || !latest) return;
            viewport.scrollTo({ top: latest.offsetTop, behavior: reducedMotion ? "instant" : "smooth" });
        });

        return () => cancelAnimationFrame(frame);
    }, [exchanges.length, pendingQuestion, reducedMotion]);

    async function ask(value: string) {
        const nextQuestion = value.trim();
        if (request.current || !nextQuestion || nextQuestion.length > 600) return;

        const controller = new AbortController();
        request.current = controller;
        setPending(true);
        setPendingQuestion(nextQuestion);
        setQuestion("");
        setError("");
        setNotice("");

        try {
            const history = exchanges.slice(-3).flatMap((exchange) => [
                { role: "user", content: exchange.question.slice(0, 2000) },
                { role: "assistant", content: exchange.answer.slice(0, 2000) },
            ]);
            const response = await fetch("/api/profile-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: nextQuestion, history }),
                signal: controller.signal,
            });

            if (!response.ok) {
                if (response.status === 503) {
                    setAvailability("unavailable");
                    throw new Error(copy.unavailable);
                }
                throw new Error(response.status === 429 ? copy.limited : copy.error);
            }

            const result = readAnswer(await response.json());
            if (!result) throw new Error(copy.error);
            if (controller.signal.aborted) return;

            setAvailability("available");
            setExchanges((previous) => [
                ...previous,
                {
                    id: crypto.randomUUID(),
                    question: nextQuestion,
                    ...result,
                },
            ]);
            setPendingQuestion("");
        } catch (reason) {
            if (controller.signal.aborted) return;
            const message = reason instanceof Error ? reason.message : "";
            setError([copy.limited, copy.unavailable].includes(message) ? message : copy.error);
        } finally {
            if (request.current === controller) {
                request.current = null;
                setPending(false);
            }
        }
    }

    function cancel() {
        request.current?.abort();
        request.current = null;
        setPending(false);
        setQuestion(pendingQuestion);
        setPendingQuestion("");
        setNotice(copy.canceled);
        input.current?.focus();
    }

    function clearConversation() {
        setExchanges([]);
        setQuestion("");
        setPendingQuestion("");
        setError("");
        setNotice("Conversation cleared.");
        input.current?.focus();
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        void ask(question);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return;
        event.preventDefault();
        void ask(question);
    }

    function retryAvailability() {
        setAvailability("checking");
        setError("");
        setAvailabilityAttempt((attempt) => attempt + 1);
    }

    return (
        <section className="dds-chat" data-started={started} aria-label="Ask about Dohyeop Lim">
            <div className="dds-chat-scene">
                <div className="dds-chat-main">
                    <AnimatePresence initial={false} mode="popLayout">
                        {!started ? (
                            <motion.div
                                key="welcome"
                                className="dds-chat-welcome"
                                initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                                transition={movement}
                            >
                                <div className="dds-chat-identity">
                                    <Image
                                        src={hero.image.src}
                                        alt={hero.image.alt}
                                        width={48}
                                        height={48}
                                        priority
                                        className="dds-chat-portrait"
                                    />
                                    <div>
                                        <p>{hero.name}</p>
                                        <p className="dds-chat-role">{hero.title}</p>
                                    </div>
                                </div>
                                <h1 id={`${id}-heading`} className="font-section-title">
                                    {copy.label}
                                </h1>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="conversation"
                                className="dds-chat-conversation"
                                ref={conversation}
                                tabIndex={0}
                                role="region"
                                aria-label="Answers"
                                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={movement}
                            >
                                <h1 className="sr-only">{copy.label}</h1>
                                <div className="dds-chat-log" role="log" aria-label="Conversation" aria-live="polite">
                                    {exchanges.map((exchange, index) => (
                                        <div
                                            key={exchange.id}
                                            ref={
                                                !pendingQuestion && index === exchanges.length - 1
                                                    ? latestQuestion
                                                    : null
                                            }
                                            className="dds-chat-exchange"
                                        >
                                            <h2 className="dds-chat-question">
                                                <span className="sr-only">You asked. </span>
                                                {exchange.question}
                                            </h2>
                                            <motion.div
                                                className="dds-chat-response"
                                                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={movement}
                                            >
                                                <p className="dds-chat-answer">{exchange.answer}</p>
                                                <ProfileChatCards cards={exchange.cards} />
                                                <AnswerSources sources={exchange.sources} />
                                            </motion.div>
                                        </div>
                                    ))}
                                    {pendingQuestion && (
                                        <div ref={latestQuestion} className="dds-chat-exchange">
                                            <h2 className="dds-chat-question">
                                                <span className="sr-only">You asked. </span>
                                                {pendingQuestion}
                                            </h2>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.form
                        onSubmit={submit}
                        className="dds-chat-form"
                        layout={reducedMotion ? false : "position"}
                        transition={movement}
                    >
                        <label htmlFor={`${id}-question`} className="sr-only">
                            {started ? copy.followUp : copy.label}
                        </label>
                        <div className="dds-chat-composer">
                            <textarea
                                ref={input}
                                id={`${id}-question`}
                                name="question"
                                rows={1}
                                maxLength={600}
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={started ? copy.followUp : copy.placeholder}
                                readOnly={pending}
                                aria-describedby={`${id}-status`}
                                autoComplete="off"
                            />
                            {pending ? (
                                <IconButton
                                    key="cancel"
                                    className="dds-chat-send"
                                    variant="outline"
                                    size="medium"
                                    aria-label="Cancel answer"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        cancel();
                                    }}
                                >
                                    <Square size={14} aria-hidden="true" />
                                </IconButton>
                            ) : (
                                <IconButton
                                    key="send"
                                    className="dds-chat-send"
                                    type="submit"
                                    size="medium"
                                    aria-label="Send question"
                                    disabled={!question.trim()}
                                >
                                    <ArrowUp size={18} aria-hidden="true" />
                                </IconButton>
                            )}
                        </div>
                    </motion.form>
                    {!started && (
                        <div className="dds-chat-suggestions" aria-label="Suggested questions">
                            {copy.suggestions.map((suggestion) => (
                                <Button
                                    key={suggestion}
                                    variant="text"
                                    size="small"
                                    className="dds-chat-suggestion"
                                    onClick={() => void ask(suggestion)}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    )}
                    <div className="dds-chat-feedback">
                        <p id={`${id}-status`} className="dds-chat-status" role="status" aria-live="polite">
                            {status}
                        </p>
                        {error && pendingQuestion && (
                            <Button variant="text" size="small" onClick={() => void ask(pendingQuestion)}>
                                Try again
                            </Button>
                        )}
                        {!started && availability === "unavailable" && (
                            <Button variant="text" size="small" onClick={retryAvailability}>
                                Try again
                            </Button>
                        )}
                    </div>
                </div>
                <div className="dds-chat-footer">
                    <LinkButton href="#research" label="Browse portfolio" />
                    {started && (
                        <Button variant="text" size="small" onClick={clearConversation} disabled={pending}>
                            Clear conversation
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}
