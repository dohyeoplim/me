import LinkButton from "@/app/components/LinkButton";
import SectionTitle from "@/app/components/SectionTitle";
import type { IntroLink } from "@/app/lib/content/schema";

type Props = {
    profileLabel: string;
    bio: string;
    links: IntroLink[];
};

export default function Bio({ profileLabel, bio, links }: Props) {
    return (
        <div className="flex flex-col gap-8 select-none">
            <div className="flex flex-col gap-4">
                <SectionTitle subtitle={profileLabel} />
                <p className="font-body02-light text-grey-700 whitespace-pre-line">
                    {bio}
                </p>
            </div>

            <div className="flex items-center gap-3">
                {links.map((link, i) => (
                    <LinkButton
                        key={i}
                        label={link.label}
                        href={link.href}
                        icon={link.icon}
                    />
                ))}
            </div>
        </div>
    );
}
