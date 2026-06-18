import * as motion from "motion/react-client";

type Props = {
    name: string;
    tagline: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Name({ name, tagline }: Props) {
    return (
        <div className="flex flex-col gap-2 text-grey-900 select-none">
            <motion.h1
                className="font-title01-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease, delay: 0.05 }}
            >
                {name}
            </motion.h1>
            <motion.h2
                className="font-body01-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease, delay: 0.18 }}
            >
                {tagline}
            </motion.h2>
        </div>
    );
}
