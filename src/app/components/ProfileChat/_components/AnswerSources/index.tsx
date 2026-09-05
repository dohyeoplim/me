import Link from "next/link";
import type { ProfileSource } from "@/app/lib/profile-chat/types";

export function sourceHref(value: string) {
    if (/^\/(?![\\/])/.test(value) || value.startsWith("#")) return value;

    try {
        const url = new URL(value);
        return url.protocol === "https:" ? url.href : null;
    } catch {
        return null;
    }
}

export default function AnswerSources({ sources }: { sources: ProfileSource[] }) {
    const available = sources.filter(({ url }) => sourceHref(url));
    if (available.length === 0) return null;

    return (
        <nav className="dds-chat-sources" aria-label="Sources for this answer">
            {available.map((source) => (
                source.url.startsWith("http") ? (
                    <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title}
                    </a>
                ) : (
                    <Link key={source.id} href={source.url}>{source.title}</Link>
                )
            ))}
        </nav>
    );
}
