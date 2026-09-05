"use client";

import { motion, useReducedMotion } from "motion/react";
import { getDdsMotionTransition } from "@/app/components/DDS/Motion";

const lineLengths = ["full", "long", "short"] as const;

export default function AnswerLoading() {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            className="dds-chat-answer-loading"
            aria-hidden="true"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={getDdsMotionTransition(reducedMotion)}
        >
            {lineLengths.map((length, index) => (
                <span key={length} className="dds-chat-answer-loading-line" data-length={length}>
                    {!reducedMotion && (
                        <motion.span
                            className="dds-chat-answer-loading-scan"
                            initial={{ x: "-110%" }}
                            animate={{ x: "110%" }}
                            transition={{
                                duration: 1.6,
                                delay: index * 0.08,
                                ease: [0.4, 0, 0.2, 1],
                                repeat: Infinity,
                                repeatDelay: 0.32,
                            }}
                        />
                    )}
                </span>
            ))}
        </motion.div>
    );
}
