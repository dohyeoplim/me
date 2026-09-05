"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Button from "@/app/components/DDS/Button";
import type { KnowledgeSource } from "@/app/lib/knowledge/schema";
import type { GitHubSyncReport } from "@/app/lib/knowledge/github";
import { useDirty } from "../../../_components/shared/dirty";
import { syncGitHubAction } from "../../actions";
import KnowledgeEditor from "../KnowledgeEditor";

type Props = { sources: KnowledgeSource[]; selectedId?: string };

export default function KnowledgeManager({ sources, selectedId }: Props) {
    const router = useRouter();
    const dirty = useDirty();
    const [pending, startTransition] = useTransition();
    const [report, setReport] = useState<GitHubSyncReport | null>(null);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const selected = sources.find(({ id }) => id === selectedId);
    const visible = sources.filter((source) => {
        const matches = filter === "all" || source.status === filter || source.origin === filter;
        return matches && `${source.title} ${source.keywords.join(" ")}`.toLowerCase().includes(search.toLowerCase());
    });

    const refresh = () => {
        setError("");
        startTransition(async () => {
            try {
                const result = await syncGitHubAction();
                if (!result.ok) return setError(result.error);
                setReport(result.value);
                router.refresh();
            } catch {
                setError("GitHub refresh did not finish. Try again.");
            }
        });
    };

    const canNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (dirty && !window.confirm("Discard unsaved changes?")) event.preventDefault();
    };

    return (
        <div className="knowledge-manager">
            <div className="knowledge-toolbar">
                <Link className="dds-link" href="/admin" onClick={canNavigate}>Back to admin</Link>
                <div className="knowledge-actions">
                    <Link
                        className="ds-button"
                        data-variant="outline"
                        data-size="medium"
                        href="/admin/knowledge?source=new"
                        onClick={canNavigate}
                    >
                        Add note
                    </Link>
                    <Button variant="outline" onClick={refresh} disabled={pending}>
                        {pending ? "Refreshing GitHub..." : "Refresh GitHub"}
                    </Button>
                </div>
            </div>
            <p className="knowledge-help">
                Published sources are available to the assistant. Drafts are excluded from new answers.
                GitHub refresh keeps your edits and publication choices.
            </p>
            {error && <p role="alert">{error}</p>}
            {report && (
                <div className="knowledge-report" role="status">
                    <p>
                        Added {report.added} repositories and refreshed {report.refreshed}.
                        Found {report.candidates} candidates and skipped {report.ignoredForks} forks.
                    </p>
                    {report.limited && <p>Some results were limited. Current saved sources are available below.</p>}
                    {report.errors.length > 0 && (
                        <details>
                            <summary>Refresh details</summary>
                            <ul>{report.errors.map((message) => <li key={message}>{message}</li>)}</ul>
                        </details>
                    )}
                </div>
            )}
            <div className="knowledge-workspace">
                <aside className="knowledge-library" aria-label="Knowledge sources">
                    <label className="knowledge-field">
                        Find a source
                        <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" />
                    </label>
                    <label className="knowledge-field">
                        Show
                        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                            <option value="all">All sources</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                            <option value="portfolio">Portfolio</option>
                            <option value="manual">Notes</option>
                            <option value="github">GitHub</option>
                        </select>
                    </label>
                    <nav className="knowledge-source-list" aria-label="Select a source">
                        {visible.map((source) => (
                            <Link
                                key={source.id}
                                href={`/admin/knowledge?source=${encodeURIComponent(source.id)}`}
                                onClick={canNavigate}
                                aria-current={source.id === selectedId ? "page" : undefined}
                            >
                                <span>{source.title}</span>
                                <span className="knowledge-help">
                                    {source.status === "draft" ? "Draft" : "Published"}
                                </span>
                            </Link>
                        ))}
                        {!visible.length && <p className="knowledge-help">No matching sources.</p>}
                    </nav>
                </aside>
                {selected || selectedId === "new" ? (
                    <KnowledgeEditor key={selected?.id ?? "new"} source={selected ?? null} />
                ) : (
                    <div className="knowledge-empty">
                        <h2 className="font-work-title">Select a source to edit</h2>
                        <p>Change the facts, add a note, or unpublish information the assistant should skip.</p>
                        <p className="knowledge-help">
                            Repository descriptions are public project information. Organization membership alone
                            does not establish your personal contribution.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
