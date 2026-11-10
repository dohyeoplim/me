"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Button from "@/app/components/DDS/Button";
import Select from "@/app/components/DDS/Select";
import { CONFERENCE_AREAS, type Conference } from "@/app/lib/deadlines/schema";
import { setConferenceVisibilityAction, syncDeadlinesAction } from "../../actions";

type Props = { conferences: Conference[] };

export default function DeadlineManager({ conferences }: Props) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();

    const run = (task: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string) => {
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
        <nav className="knowledge-actions">
            <Link className="dds-link" href="/admin">Back to admin</Link>
            <Button variant="soft" size="small" disabled={pending}
                onClick={() => run(syncDeadlinesAction, "Deadlines synced.")}>
                {pending ? "Syncing..." : "Sync now"}
            </Button>
        </nav>
        <p className="knowledge-help">Synced daily from ccfddl. Hidden conferences stay hidden after each sync.</p>
        <div className="knowledge-library"><div className="knowledge-table-wrap"><table className="knowledge-table">
            <thead><tr><th>Conference</th><th>Area</th><th>Deadlines</th><th>Visibility</th></tr></thead>
            <tbody>{conferences.map((conference) => <tr key={conference.id}>
                <td><a className="dds-link" href={conference.url} target="_blank" rel="noreferrer">
                    {conference.name} {conference.year}
                </a></td>
                <td>{CONFERENCE_AREAS[conference.area]}</td>
                <td>{conference.deadlines.length || "Not announced"}</td>
                <td>
                    <Select value={conference.status} disabled={pending}
                        aria-label={`Visibility for ${conference.name}`}
                        onChange={(event) => run(() => setConferenceVisibilityAction({
                            id: conference.id, status: event.target.value,
                        }), "Visibility updated.")}>
                        <option value="published">Published</option>
                        <option value="draft">Hidden</option>
                    </Select>
                </td>
            </tr>)}</tbody>
        </table></div></div>
        {conferences.length === 0 && <p className="knowledge-help">No conferences yet. Run a sync to load them.</p>}
        {error && <p role="alert">{error}</p>}
        <p role="status">{message}</p>
    </>;
}
