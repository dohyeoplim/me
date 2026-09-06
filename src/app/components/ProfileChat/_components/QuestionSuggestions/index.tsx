"use client";

import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { ddsMotionTransition, getDdsMotionTransition } from "@/app/components/DDS/Motion";
import type { ProfileFollowUp } from "@/app/lib/profile-chat/types";

type Props = {
    questions: ProfileFollowUp[];
    onSelect: (question: string, sourceIds: string[]) => void;
    disabled?: boolean;
    label?: string;
    layout?: "grid" | "compact";
    animateEntrance?: boolean;
    animateLayout?: boolean;
    staggerCount?: number;
};

export default function QuestionSuggestions({
    questions,
    onSelect,
    disabled,
    label = "Suggested questions",
    layout = "grid",
    animateEntrance = false,
    animateLayout = true,
    staggerCount = questions.length,
}: Props) {
    const reducedMotion = useReducedMotion();
    const shouldAnimateLayout = animateLayout && !reducedMotion;
    if (!questions.length) return null;

    return (
        <motion.div
            layout={shouldAnimateLayout ? "position" : false}
            className="dds-question-grid"
            data-layout={layout}
            role="group"
            aria-label={label}
            transition={getDdsMotionTransition(reducedMotion)}
        >
            {questions.map(({ label: title, question, sourceIds }, index) => {
                const initialQuestion = index < staggerCount;
                const entranceDelay = initialQuestion
                    ? index * 0.05
                    : ddsMotionTransition.duration + (index - staggerCount) * 0.04;
                const entranceTransition = reducedMotion
                    ? { duration: 0 }
                    : { ...ddsMotionTransition, delay: animateEntrance ? entranceDelay : 0 };

                return (
                    <motion.button
                        layout={shouldAnimateLayout ? "position" : false}
                        key={question}
                        type="button"
                        data-variant="outline"
                        data-size="medium"
                        className="ds-button dds-question-card"
                        onClick={() => onSelect(question, sourceIds)}
                        disabled={disabled}
                        initial={animateEntrance ? { opacity: 0 } : false}
                        animate={{
                            opacity: 1,
                            transition: entranceTransition,
                        }}
                        transition={getDdsMotionTransition(reducedMotion)}
                    >
                        <span>{title}</span>
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
