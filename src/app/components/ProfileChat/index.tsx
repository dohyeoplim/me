"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUp, Square } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import IconButton from "@/app/components/DDS/IconButton";
import { hero } from "@/app/portfolio/_data/hero";
import Conversation from "./_components/Conversation";
import QuestionSuggestions from "./_components/QuestionSuggestions";
import { suggestedQuestions } from "./_data/questions";
import useProfileConversation, { chatCopy } from "./_hooks/useProfileConversation";

const transition = { duration: 0.24, ease: [0.2, 0, 0, 1] as const };

export default function ProfileChat() {
    const id = useId();
    const input = useRef<HTMLTextAreaElement>(null);
    const reducedMotion = useReducedMotion();
    const [showAllQuestions, setShowAllQuestions] = useState(false);
    const chat = useProfileConversation();
    const { exchanges, question, setQuestion, pending, pendingQuestion, availability, error, notice, ask } = chat;
    const started = exchanges.length > 0 || pendingQuestion.length > 0;
    const movement = reducedMotion ? { duration: 0 } : transition;
    const availabilityStatus = availability === "unavailable"
        ? chatCopy.unavailable
        : notice || "AI answers from public profile information.";
    const status = pending ? chatCopy.pending : error || availabilityStatus;

    useEffect(() => {
        if (!input.current) return;
        input.current.style.height = "auto";
        input.current.style.height = `${input.current.scrollHeight}px`;
    }, [question]);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        void ask(question);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return;
        event.preventDefault();
        void ask(question);
    }

    function selectQuestion(value: string, sourceIds: string[]) {
        void ask(value, sourceIds);
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
                                <h1 className="font-section-title">{chatCopy.label}</h1>
                            </motion.div>
                        ) : (
                            <Conversation
                                key="conversation"
                                exchanges={exchanges}
                                pendingQuestion={pendingQuestion}
                                pending={pending}
                                onSelectQuestion={selectQuestion}
                            />
                        )}
                    </AnimatePresence>
                    <motion.form
                        onSubmit={submit}
                        className="dds-chat-form"
                        layout={reducedMotion ? false : "position"}
                        transition={movement}
                    >
                        <label htmlFor={`${id}-question`} className="sr-only">
                            {started ? chatCopy.followUp : chatCopy.label}
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
                                placeholder={started ? chatCopy.followUp : chatCopy.placeholder}
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
                                        chat.cancel();
                                        input.current?.focus();
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
                        <section className="dds-chat-suggestions" aria-label="Explore my profile">
                            <QuestionSuggestions
                                questions={suggestedQuestions.slice(0, showAllQuestions ? undefined : 8)}
                                onSelect={selectQuestion}
                            />
                            <Button
                                variant="text"
                                size="small"
                                aria-expanded={showAllQuestions}
                                onClick={() => setShowAllQuestions((previous) => !previous)}
                            >
                                {showAllQuestions ? "Fewer questions" : "More questions"}
                            </Button>
                        </section>
                    )}
                    <div className="dds-chat-feedback">
                        <p id={`${id}-status`} className="dds-chat-status" role="status" aria-live="polite">
                            {status}
                        </p>
                        {error && pendingQuestion && (
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => void ask(pendingQuestion, chat.pendingContext)}
                            >
                                Try again
                            </Button>
                        )}
                        {!started && availability === "unavailable" && (
                            <Button variant="text" size="small" onClick={chat.retryAvailability}>
                                Try again
                            </Button>
                        )}
                    </div>
                </div>
                <div className="dds-chat-footer">
                    <Link href="/portfolio" className="dds-link" data-icon="arrow">
                        <span className="dds-link-label">Browse portfolio</span>
                        <ArrowRight size={14} className="dds-link-icon" aria-hidden="true" />
                    </Link>
                    {started && (
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                                chat.clearConversation();
                                input.current?.focus();
                            }}
                            disabled={pending}
                        >
                            Clear conversation
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}
