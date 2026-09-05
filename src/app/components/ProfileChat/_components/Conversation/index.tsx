"use client";

import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import Button from "@/app/components/DDS/Button";
import type { ProfileExchange } from "../../Context";
import AnswerBlocks from "../AnswerBlocks";
import AnswerCards from "../AnswerCards";
import AnswerLoading from "../AnswerLoading";
import RepositoryCards from "../RepositoryCards";

type Props = {
    exchanges: ProfileExchange[];
    pendingQuestion: string;
    pending: boolean;
    error?: string;
    onRetry?: () => void;
};

export default function Conversation({ exchanges, pendingQuestion, pending, error, onRetry }: Props) {
    const conversation = useRef<HTMLDivElement>(null);
    const latestExchange = useRef<HTMLDivElement>(null);
    const latestQuestion = useRef<HTMLHeadingElement>(null);
    const scrollSpace = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const movement = { duration: reducedMotion ? 0 : 0.24, ease: [0.2, 0, 0, 1] as const };

    useLayoutEffect(() => {
        const viewport = conversation.current;
        const exchange = latestExchange.current;
        const latest = latestQuestion.current;
        const spacer = scrollSpace.current;
        if (!viewport || !exchange || !latest || !spacer) return;
        const align = () => {
            const topInset = Number.parseFloat(getComputedStyle(viewport).paddingTop) || 0;
            spacer.style.height = `${Math.max(0, viewport.clientHeight - exchange.offsetHeight - topInset)}px`;
            viewport.scrollTo({
                top: Math.max(0, latest.offsetTop - topInset),
                behavior: "auto",
            });
        };
        const observer = new ResizeObserver(align);
        observer.observe(viewport);
        observer.observe(exchange);
        align();
        return () => observer.disconnect();
    }, [exchanges.length, pendingQuestion, reducedMotion]);

    return (
        <motion.div
            className="dds-chat-conversation"
            ref={conversation}
            tabIndex={0}
            role="region"
            aria-label="Answers"
            aria-busy={pending}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={movement}
        >
            <h1 className="sr-only">Ask anything about me</h1>
            <div className="dds-chat-log" role="log" aria-label="Conversation" aria-live="polite">
                {exchanges.map((exchange, index) => {
                    const latest = !pendingQuestion && index === exchanges.length - 1;

                    return (
                        <div key={exchange.id} ref={latest ? latestExchange : null} className="dds-chat-exchange">
                            <h2 ref={latest ? latestQuestion : null} className="dds-chat-question">
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
                                <AnswerBlocks blocks={exchange.blocks} />
                                <RepositoryCards repositories={exchange.repositories} />
                            </motion.div>
                        </div>
                    );
                })}
                {pendingQuestion && (
                    <div ref={latestExchange} className="dds-chat-exchange">
                        <h2 ref={latestQuestion} className="dds-chat-question">
                            <span className="sr-only">You asked. </span>
                            {pendingQuestion}
                        </h2>
                        {pending && <AnswerLoading />}
                        {!pending && error && (
                            <motion.div
                                className="dds-chat-request-error"
                                role="alert"
                                initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={movement}
                            >
                                <p>{error}</p>
                                {onRetry && (
                                    <Button variant="text" size="small" onClick={onRetry}>
                                        Try again
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}
                <div ref={scrollSpace} className="dds-chat-scroll-space" aria-hidden="true" />
            </div>
        </motion.div>
    );
}
