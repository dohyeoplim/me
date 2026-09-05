import { ArrowUpRight, GitFork } from "lucide-react";
import type { ProfileRepository } from "@/app/lib/profile-chat/types";

type Props = { repositories: ProfileRepository[] };

export default function RepositoryCards({ repositories }: Props) {
    if (!repositories.length) return null;

    return (
        <section className="dds-repository-section" aria-label="Related project repositories">
            <h3 className="font-work-title">Related repositories</h3>
            <div className="dds-repository-grid">
                {repositories.map((repository) => (
                    <a
                        className="dds-repository-card"
                        key={repository.sourceId}
                        href={repository.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="dds-repository-heading">
                            <GitFork size={18} aria-hidden="true" />
                            <h4 className="font-body">{repository.fullName}</h4>
                            <ArrowUpRight size={16} aria-hidden="true" />
                        </div>
                        <p className="dds-repository-reason">{repository.reason}</p>
                        {repository.description && (
                            <p className="dds-repository-description">{repository.description}</p>
                        )}
                        {repository.language && <p className="dds-repository-meta">{repository.language}</p>}
                    </a>
                ))}
            </div>
        </section>
    );
}
