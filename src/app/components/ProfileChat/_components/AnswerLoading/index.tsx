"use client";

import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-m";
import { getDdsMotionTransition } from "@/app/components/DDS/Motion";
import { SkeletonText } from "@/app/components/DDS/Skeleton";

export default function AnswerLoading() {
    const reducedMotion = useReducedMotion();
    return (
        <motion.div
            className="dds-chat-answer-loading"
            aria-hidden="true"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getDdsMotionTransition(reducedMotion)}
        >
            <SkeletonText lines={3} lastLine="medium" />
        </motion.div>
    );
}
