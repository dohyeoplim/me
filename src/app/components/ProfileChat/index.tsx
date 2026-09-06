"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { LayoutMotion } from "@/app/components/DDS/Motion/Provider";
import { ArrowUp, Square } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import IconButton from "@/app/components/DDS/IconButton";
import { getDdsMotionTransition } from "@/app/components/DDS/Motion";
import { hero } from "@/app/portfolio/_data/hero";
import Conversation from "./_components/Conversation";
import QuestionSuggestions from "./_components/QuestionSuggestions";
import { explorationQuestions, suggestedQuestions } from "./_data/questions";
import useProfileConversation, { chatCopy } from "./_hooks/useProfileConversation";

const initialQuestionCount = 8;

export default function ProfileChat() {
    return <LayoutMotion><ProfileChatContent /></LayoutMotion>;
}

function ProfileChatContent() {
    const id = useId();
    const input = useRef<HTMLTextAreaElement>(null);
    const conversation = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const [showAllQuestions, setShowAllQuestions] = useState(false);
    const [returningHome, setReturningHome] = useState(false);
    const [answerFocusRequest, setAnswerFocusRequest] = useState(0);
    const chat = useProfileConversation();
    const { exchanges, question, setQuestion, pending, pendingQuestion, availability, error, notice, ask } = chat;
    const started = exchanges.length > 0 || pendingQuestion.length > 0;
    const latestExchange = exchanges.at(-1);
    const followUps = latestExchange && !pendingQuestion
        ? explorationQuestions(latestExchange, exchanges.map(({ question }) => question))
        : [];
    const movement = getDdsMotionTransition(reducedMotion);
    const availabilityStatus = !started && availability === "unavailable"
        ? chatCopy.unavailable
        : notice;
    const status = pending ? chatCopy.pending : availabilityStatus;
    const showFeedback = Boolean(status) || (!started && availability === "unavailable") || (started && !pending);

    useEffect(() => {
        const frame = requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (CSS.supports("field-sizing", "content")) return;
        if (!input.current) return;
        input.current.style.height = "auto";
        input.current.style.height = `${input.current.scrollHeight}px`;
    }, [question]);

    function askQuestion(value: string, sourceIds?: string[]) {
        setReturningHome(false);
        void ask(value, sourceIds);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setAnswerFocusRequest(0);
        askQuestion(question);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return;
        event.preventDefault();
        setAnswerFocusRequest(0);
        askQuestion(question);
    }

    function selectQuestion(value: string, sourceIds: string[]) {
        setAnswerFocusRequest((request) => request + 1);
        askQuestion(value, sourceIds);
    }

    function retryPendingQuestion() {
        setAnswerFocusRequest((request) => request + 1);
        askQuestion(pendingQuestion, chat.pendingContext);
    }

    function clearConversation() {
        setReturningHome(true);
        setAnswerFocusRequest(0);
        setShowAllQuestions(false);
        chat.clearConversation();
    }

    return (
        <AnimatePresence initial={false} mode="wait">
            <motion.section key={started ? "conversation" : "welcome"}
                className={started ? "dds-chat" : "dds-chat dds-grid-backdrop"}
                data-started={started} aria-label="Ask about Dohyeop Lim"
                initial={{ opacity: 0 }} animate={{ opacity: 1, pointerEvents: "auto" }}
                exit={{ opacity: 0, pointerEvents: "none" }} transition={movement}
                onAnimationComplete={() => {
                    if (!started) setReturningHome(false);
                    if (!started || answerFocusRequest === 0) input.current?.focus({ preventScroll: true });
                }}>
                <div className="dds-chat-scene">
                    <LayoutGroup id={`${id}-home`}>
                        <motion.div
                            className="dds-chat-main"
                            transition={movement}
                        >
                            {!started && <div className="dds-chat-glow" aria-hidden="true" />}
                            {!started ? (
                                <motion.div
                                    key="welcome"
                                    className="dds-chat-welcome"
                                    initial={false}
                                    animate={{ opacity: 1, y: 0 }}
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
                                    focusRequest={answerFocusRequest}
                                    viewportRef={conversation}
                                    onRetry={retryPendingQuestion}
                                    followUps={followUps.length > 0 && (
                                        <motion.section
                                            key={latestExchange?.id}
                                            className="dds-chat-followups"
                                            aria-label="Follow-up questions"
                                            initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                                            animate={{ opacity: 1, y: 0 }}
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
                            />
                        )}
                        <div className="dds-chat-dock">
                            <form onSubmit={submit} className="dds-chat-form">
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
                                    <p
                                        id={`${id}-status`}
                                        className="dds-chat-status"
                                        role="status"
                                        aria-live="polite"
                                    >
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
                                            size="medium"
                                            onClick={clearConversation}
                                            aria-label="Clear conversation"
                                        >
                                            Clear conversation
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                        {!started && (
                            <motion.section
                                className="dds-chat-suggestions"
                                aria-label="Explore my profile"
                                transition={movement}
                            >
                                <QuestionSuggestions
                                    questions={suggestedQuestions.slice(0, initialQuestionCount)}
                                    onSelect={selectQuestion}
                                    animateEntrance={!returningHome}
                                    animateLayout={false}
                                    staggerCount={initialQuestionCount}
                                />
                                <motion.div
                                    className="dds-chat-more-viewport"
                                    initial={false}
                                    animate={{ height: showAllQuestions ? "auto" : 0, opacity: showAllQuestions ? 1 : 0 }}
                                    transition={movement}
                                    inert={!showAllQuestions}
                                    aria-hidden={!showAllQuestions}
                                >
                                    <div className="dds-chat-more-questions">
                                        <QuestionSuggestions
                                            questions={suggestedQuestions.slice(initialQuestionCount)}
                                            onSelect={selectQuestion}
                                            animateLayout={false}
                                            label="More suggested questions"
                                        />
                                    </div>
                                </motion.div>
                                <div className="dds-chat-more-control">
                                    <Button
                                        variant="text"
                                        size="medium"
                                        aria-expanded={showAllQuestions}
                                        onClick={() => setShowAllQuestions((previous) => !previous)}
                                    >
                                        {showAllQuestions ? "Fewer questions" : "More questions"}
                                    </Button>
                                </div>
                            </motion.section>
                        )}
                    </motion.div>
                </LayoutGroup>
            </div>
        </motion.section>
        </AnimatePresence>
    );
}
