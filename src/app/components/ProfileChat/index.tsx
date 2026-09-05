"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUp, Square } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import IconButton from "@/app/components/DDS/IconButton";
import { hero } from "@/app/portfolio/_data/hero";
import Conversation from "./_components/Conversation";
import QuestionSuggestions from "./_components/QuestionSuggestions";
import { followUpQuestions, suggestedQuestions } from "./_data/questions";
import useProfileConversation, { chatCopy } from "./_hooks/useProfileConversation";

const transition = { duration: 0.24, ease: [0.2, 0, 0, 1] as const };
const initialQuestionCount = 8;

export default function ProfileChat() {
    const id = useId();
    const input = useRef<HTMLTextAreaElement>(null);
    const reducedMotion = useReducedMotion();
    const [showAllQuestions, setShowAllQuestions] = useState(false);
    const chat = useProfileConversation();
    const { exchanges, question, setQuestion, pending, pendingQuestion, availability, error, notice, ask } = chat;
    const started = exchanges.length > 0 || pendingQuestion.length > 0;
    const latestExchange = exchanges.at(-1);
    const followUps = latestExchange && !pendingQuestion
        ? followUpQuestions(latestExchange, exchanges.map(({ question: previousQuestion }) => previousQuestion))
        : [];
    const movement = reducedMotion ? { duration: 0 } : transition;
    const availabilityStatus = !started && availability === "unavailable"
        ? chatCopy.unavailable
        : notice;
    const status = pending ? chatCopy.pending : availabilityStatus;
    const showFeedback = Boolean(status) || (!started && availability === "unavailable") || (started && !pending);

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
                <LayoutGroup id={`${id}-home`}>
                    <motion.div
                        className="dds-chat-main"
                    layout={!started && !reducedMotion ? "position" : false}
                    transition={movement}
                >
                        {!started && <div className="dds-chat-glow" aria-hidden="true" />}
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
                                    error={error}
                                    onRetry={() => void ask(pendingQuestion, chat.pendingContext)}
                                />
                            )}
                        </AnimatePresence>
                        <div className="dds-chat-dock">
                            <AnimatePresence initial={false} mode="popLayout">
                                {followUps.length > 0 && (
                                    <motion.section
                                        key={latestExchange?.id}
                                        className="dds-chat-followups"
                                        aria-label="Follow-up questions"
                                        initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
                                        transition={movement}
                                    >
                                        <h2>Keep exploring</h2>
                                        <QuestionSuggestions
                                            questions={followUps}
                                            onSelect={selectQuestion}
                                            disabled={pending}
                                            label="Follow-up questions"
                                            layout="compact"
                                        />
                                    </motion.section>
                                )}
                            </AnimatePresence>
                            <form
                                onSubmit={submit}
                                className="dds-chat-form"
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
                                    aria-describedby={status ? `${id}-status` : undefined}
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
                            </form>
                        {showFeedback && (
                            <div className="dds-chat-feedback">
                                <p id={`${id}-status`} className="dds-chat-status" role="status" aria-live="polite">
                                    {status}
                                </p>
                                {!started && availability === "unavailable" && (
                                    <Button variant="text" size="small" onClick={chat.retryAvailability}>
                                        Try again
                                    </Button>
                                )}
                                {started && !pending && (
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => {
                                            chat.clearConversation();
                                            input.current?.focus();
                                        }}
                                        aria-label="Clear conversation"
                                    >
                                        Clear conversation
                                    </Button>
                                )}
                            </div>
                        )}
                        </div>
                        {!started && (
                            <section
                                className="dds-chat-suggestions"
                                aria-label="Explore my profile"
                            >
                                <QuestionSuggestions
                                    questions={suggestedQuestions.slice(
                                        0,
                                        showAllQuestions ? undefined : initialQuestionCount,
                                    )}
                                    onSelect={selectQuestion}
                                    animateEntrance
                                    staggerCount={initialQuestionCount}
                                />
                                <motion.div layout={reducedMotion ? false : "position"} transition={movement}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        aria-expanded={showAllQuestions}
                                        onClick={() => setShowAllQuestions((previous) => !previous)}
                                    >
                                        {showAllQuestions ? "Fewer questions" : "More questions"}
                                    </Button>
                                </motion.div>
                            </section>
                        )}
                    </motion.div>
                </LayoutGroup>
            </div>
        </section>
    );
}
