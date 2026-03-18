import * as motion from "motion/react-client";
import type { Variants } from "motion";
import { SectionTitleProps } from "./types";

const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.05,
        },
    },
};

export default function SectionTitle({
    title,
    subtitle,
    includeStroke = true,
}: SectionTitleProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="flex flex-col gap-4 select-none"
        >
            {subtitle && (
                <motion.div variants={item} className="flex items-center gap-3">
                    {includeStroke && (
                        <div className="w-8 h-[0.5px] bg-grey-500" />
                    )}
                    <h3 className="font-caption02-light text-grey-500 uppercase">
                        {subtitle}
                    </h3>
                </motion.div>
            )}

            {title && (
                <motion.h2
                    variants={item}
                    transition={{ delay: 0.08 }}
                    className="font-title02-light text-grey-900"
                >
                    {title}
                </motion.h2>
            )}
        </motion.div>
    );
}
