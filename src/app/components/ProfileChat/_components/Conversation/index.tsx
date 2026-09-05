"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import Disclosure from "@/app/components/DDS/Disclosure";
import type { ProfileExchange } from "../../Context";
import { followUpQuestions, suggestedQuestions } from "../../_data/questions";
import AnswerBlocks from "../AnswerBlocks";
import AnswerCards from "../AnswerCards";
import AnswerSources from "../AnswerSources";
import QuestionSuggestions from "../QuestionSuggestions";
import RepositoryCards from "../RepositoryCards";

type Props = {
    exchanges: ProfileExchange[];
    pendingQuestion: string;
    pending: boolean;
    onSelectQuestion: (question: string, sourceIds: string[]) => void;
};

export default function Conversation({ exchanges, pendingQuestion, pending, onSelectQuestion }: Props) {
    const conversation = useRef<HTMLDivElement>(null);
    const latestQuestion = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const movement = { duration: reducedMotion ? 0 : 0.24, ease: [0.2, 0, 0, 1] as const };
    const previousQuestions = exchanges.map(({ question }) => question);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const viewport = conversation.current;
            const latest = latestQuestion.current;
            if (!viewport || !latest) return;
            viewport.scrollTo({ top: latest.offsetTop, behavior: reducedMotion ? "instant" : "smooth" });
        });

        return () => cancelAnimationFrame(frame);
    }, [exchanges.length, pendingQuestion, reducedMotion]);

    return (
        <motion.div
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
            <h1 className="sr-only">Ask anything about me</h1>
            <div className="dds-chat-log" role="log" aria-label="Conversation" aria-live="polite">
                {exchanges.map((exchange, index) => {
                    const latest = !pendingQuestion && index === exchanges.length - 1;
                    const linkedSources = new Set([
                        ...exchange.blocks.flatMap(({ sourceIds }) => sourceIds),
                        ...exchange.repositories.map(({ sourceId }) => sourceId),
                    ]);

                    return (
                        <div key={exchange.id} ref={latest ? latestQuestion : null} className="dds-chat-exchange">
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
                                <AnswerCards cards={exchange.cards} />
                                <AnswerBlocks blocks={exchange.blocks} sources={exchange.sources} />
                                <RepositoryCards repositories={exchange.repositories} />
                                <AnswerSources sources={exchange.sources.filter(({ id }) => !linkedSources.has(id))} />
                            </motion.div>
                            {latest && (
                                <section className="dds-chat-followups" aria-label="Follow-up questions">
                                    <h3 className="font-work-title">Keep exploring</h3>
                                    <QuestionSuggestions
                                        questions={followUpQuestions(exchange, previousQuestions)}
                                        onSelect={onSelectQuestion}
                                        disabled={pending}
                                        label="Follow-up questions"
                                    />
                                    <Disclosure label="Browse all questions" variant="plain">
                                        <QuestionSuggestions
                                            questions={suggestedQuestions}
                                            onSelect={onSelectQuestion}
                                            disabled={pending}
                                            label="All questions"
                                        />
                                    </Disclosure>
                                </section>
                            )}
                        </div>
                    );
                })}
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
    );
}
