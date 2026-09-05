"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ProfileFollowUp } from "@/app/lib/profile-chat/types";

const movement = { duration: 0.24, ease: [0.2, 0, 0, 1] as const };

type Props = {
    questions: ProfileFollowUp[];
    onSelect: (question: string, sourceIds: string[]) => void;
    disabled?: boolean;
    label?: string;
    layout?: "grid" | "compact";
    animateEntrance?: boolean;
    staggerCount?: number;
};

export default function QuestionSuggestions({
    questions,
    onSelect,
    disabled,
    label = "Suggested questions",
    layout = "grid",
    animateEntrance = false,
    staggerCount = questions.length,
}: Props) {
    const reducedMotion = useReducedMotion();
    if (!questions.length) return null;

    return (
        <motion.div
            layout={reducedMotion ? false : true}
            className="dds-question-grid"
            data-layout={layout}
            role="group"
            aria-label={label}
            transition={movement}
        >
            <AnimatePresence initial={animateEntrance && !reducedMotion} mode="popLayout">
                {questions.map(({ label: title, question, sourceIds }, index) => (
                    <motion.button
                        layout={reducedMotion ? false : "position"}
                        key={question}
                        type="button"
                        data-variant="outline"
                        data-size="medium"
                        className="ds-button dds-question-card"
                        onClick={() => onSelect(question, sourceIds)}
                        disabled={disabled}
                        initial={animateEntrance && !reducedMotion ? { opacity: 0 } : false}
                        animate={{
                            opacity: 1,
                            transition: {
                                ...movement,
                                delay: animateEntrance && index < staggerCount ? index * 0.05 : 0,
                            },
                        }}
                        exit={reducedMotion ? undefined : { opacity: 0, transition: movement }}
                    >
                        <span>{title}</span>
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </motion.button>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
