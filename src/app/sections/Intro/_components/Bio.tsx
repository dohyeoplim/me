import * as motion from "motion/react-client";
import LinkButton from "@/app/components/LinkButton";
import SectionTitle from "@/app/components/SectionTitle";
import type { IntroLink } from "@/app/lib/content/schema";

type Props = {
    profileLabel: string;
    bio: string;
    links: IntroLink[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Bio({ profileLabel, bio, links }: Props) {
    return (
        <div className="flex flex-col gap-8 select-none">
            <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease, delay: 0.3 }}
            >
                <SectionTitle subtitle={profileLabel} />
                <p className="font-body02-light text-grey-700 whitespace-pre-line">
                    {bio}
                </p>
            </motion.div>

            <div className="flex items-center gap-3">
                {links.map((link, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            ease,
                            delay: 0.45 + i * 0.1,
                        }}
                    >
                        <LinkButton
                            label={link.label}
                            href={link.href}
                            icon={link.icon}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
