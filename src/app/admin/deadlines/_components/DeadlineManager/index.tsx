"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Button from "@/app/components/DDS/Button";
import type { Conference } from "@/app/lib/deadlines/schema";
import { setConferenceVisibilityAction, syncDeadlinesAction } from "../../actions";

export type ConferenceRow = { id: string; title: string; url: string; status: Conference["status"]; deadline: string };

type Result = { ok: true } | { ok: false; error: string };

export default function DeadlineManager({ rows }: { rows: ConferenceRow[] }) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();
    const visible = rows.filter(({ status }) => status === "published").length;

    const run = (task: () => Promise<Result>, success: string) => {
        setMessage("");
        setError("");
        startTransition(async () => {
            try {
                const result = await task();
                if (!result.ok) return setError(result.error);
                setMessage(success);
                router.refresh();
            } catch {
                setError("The request did not finish. Refresh and try again.");
            }
        });
    };

    return <>
        <nav className="knowledge-actions"><Link className="dds-link" href="/admin">Back to admin</Link></nav>
        <section className="knowledge-library" aria-label="Conferences" aria-busy={pending}>
            <div className="knowledge-library-heading">
                <div className="knowledge-heading">
                    <h2 className="font-work-title">Conferences</h2>
                    <span className="knowledge-help">{visible} of {rows.length} shown</span>
                </div>
                <Button variant="soft" size="small" disabled={pending}
                    onClick={() => run(syncDeadlinesAction, "Deadlines synced.")}>
                    {pending ? "Working..." : "Sync now"}
                </Button>
            </div>
            {rows.length === 0 ? (
                <p className="knowledge-help">No conferences yet. Run a sync to load them.</p>
            ) : (
                <ul className="deadline-admin-list">
                    {rows.map((row) => {
                        const hidden = row.status === "draft";
                        return <li key={row.id} className="deadline-admin-row" data-hidden={hidden || undefined}>
                            <div className="deadline-admin-title">
                                <a href={row.url} target="_blank" rel="noreferrer">{row.title}</a>
                                <span className="knowledge-help">{hidden ? "Hidden" : row.deadline}</span>
                            </div>
                            <Button variant="text" size="small" disabled={pending}
                                aria-label={`${hidden ? "Show" : "Hide"} ${row.title}`}
                                onClick={() => run(() => setConferenceVisibilityAction({
                                    id: row.id, status: hidden ? "published" : "draft",
                                }), hidden ? `${row.title} is shown.` : `${row.title} is hidden.`)}>
                                {hidden ? "Show" : "Hide"}
                            </Button>
                        </li>;
                    })}
                </ul>
            )}
            {error && <p role="alert">{error}</p>}
            <p role="status" className="knowledge-help">{message}</p>
        </section>
    </>;
}
