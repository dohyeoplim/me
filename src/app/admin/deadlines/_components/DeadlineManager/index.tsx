"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Button from "@/app/components/DDS/Button";
import Select from "@/app/components/DDS/Select";
import Sheet from "@/app/components/DDS/Sheet";
import { CONFERENCE_AREAS, type Conference, type ConferenceArea } from "@/app/lib/deadlines/schema";
import {
    DEADLINE_OFFSETS,
    joinDeadlineTime,
    splitDeadlineTime,
    type DeadlineInput,
} from "@/app/lib/deadlines/form";
import { useDirty, useRegisterDirty } from "../../../_components/shared/dirty";
import { deleteConferenceAction, saveConferenceAction } from "../../actions";

type Props = { conferences: Conference[] };

const newConference: Conference = {
    id: "new",
    name: "",
    year: new Date().getFullYear() + 1,
    area: "ml",
    url: "https://",
    location: "",
    startsOn: null,
    endsOn: null,
    deadlines: [],
    status: "draft",
};

export default function DeadlineManager({ conferences }: Props) {
    const [selected, setSelected] = useState<Conference | null>(null);
    const dirty = useDirty();
    return <>
        <nav className="knowledge-actions">
            <Link className="dds-link" href="/admin">Back to admin</Link>
            <Button variant="soft" size="small" onClick={() => setSelected(newConference)}>New conference</Button>
        </nav>
        <div className="knowledge-library"><div className="knowledge-table-wrap"><table className="knowledge-table">
            <thead><tr><th>Conference</th><th>Area</th><th>Deadlines</th><th>Visibility</th></tr></thead>
            <tbody>{conferences.map((conference) => <tr key={conference.id}>
                <td><button type="button" className="dds-link" onClick={() => setSelected(conference)}>
                    {conference.name} {conference.year}
                </button></td>
                <td>{CONFERENCE_AREAS[conference.area]}</td>
                <td>{conference.deadlines.length || "Not announced"}</td>
                <td>{conference.status === "published" ? "Published" : "Draft"}</td>
            </tr>)}</tbody>
        </table></div></div>
        {conferences.length === 0 && <p className="knowledge-help">No conferences yet.</p>}
        <Sheet open={Boolean(selected)} size="wide"
            title={selected && selected.id !== "new" ? `${selected.name} ${selected.year}` : "New conference"}
            beforeClose={() => !dirty || window.confirm("Discard unsaved changes?")} onClose={() => setSelected(null)}>
            {selected && <ConferenceEditor key={selected.id} conference={selected}
                onDone={() => setSelected(null)} />}
        </Sheet>
    </>;
}

type EditorValue = Omit<Conference, "deadlines" | "year"> & { year: string; deadlines: DeadlineInput[] };

function editorValue(conference: Conference): EditorValue {
    return {
        ...conference,
        year: String(conference.year),
        deadlines: conference.deadlines.map(({ label, at }) => ({ label, ...splitDeadlineTime(at) })),
    };
}

function toConference(value: EditorValue): Conference {
    return {
        ...value,
        year: Number(value.year),
        startsOn: value.startsOn || null,
        endsOn: value.endsOn || null,
        deadlines: value.deadlines.map(({ label, local, offset }) => ({ label, at: joinDeadlineTime(local, offset) })),
    };
}

function ConferenceEditor({ conference, onDone }: { conference: Conference; onDone: () => void }) {
    const router = useRouter();
    const create = conference.id === "new";
    const [value, setValue] = useState(() => editorValue(conference));
    const [baseline, setBaseline] = useState(value);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();
    const dirty = JSON.stringify(value) !== JSON.stringify(baseline);
    useRegisterDirty(dirty);

    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    const update = <K extends keyof EditorValue>(key: K, next: EditorValue[K]) => {
        setValue((current) => ({ ...current, [key]: next }));
        setMessage("");
        setError("");
    };
    const updateDeadline = (index: number, next: Partial<DeadlineInput>) => update("deadlines",
        value.deadlines.map((deadline, current) => current === index ? { ...deadline, ...next } : deadline));

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setMessage("");
        startTransition(async () => {
            try {
                const result = await saveConferenceAction(toConference(value), create);
                if (!result.ok) return setError(result.error);
                if (create) return onDone();
                const saved = editorValue(result.value);
                setValue(saved);
                setBaseline(saved);
                setMessage("Conference saved.");
            } catch {
                setError("Changes could not be saved. Your edits are still here. Try again.");
            } finally {
                router.refresh();
            }
        });
    };

    const remove = () => {
        if (!window.confirm(`Delete ${conference.name} ${conference.year}?`)) return;
        startTransition(async () => {
            try {
                const result = await deleteConferenceAction(conference.id);
                if (!result.ok) return setError(result.error);
                setBaseline(value);
                onDone();
                router.refresh();
            } catch {
                setError("This conference could not be deleted. Try again.");
            }
        });
    };

    return (
        <form className="knowledge-editor" onSubmit={save} aria-busy={pending}>
            <fieldset className="knowledge-fields" disabled={pending}>
                <div className="knowledge-field-pair">
                    <label className="knowledge-field">
                        Name
                        <input value={value.name} onChange={(event) => update("name", event.target.value)}
                            maxLength={80} required placeholder="NeurIPS" />
                    </label>
                    <label className="knowledge-field">
                        Year
                        <input type="number" value={value.year} min={2000} max={2100} required
                            onChange={(event) => update("year", event.target.value)} />
                    </label>
                </div>
                <div className="knowledge-field-pair">
                    <label className="knowledge-field">
                        Area
                        <Select value={value.area}
                            onChange={(event) => update("area", event.target.value as ConferenceArea)}>
                            {Object.entries(CONFERENCE_AREAS).map(([area, label]) => (
                                <option key={area} value={area}>{label}</option>
                            ))}
                        </Select>
                    </label>
                    <label className="knowledge-field">
                        Visibility
                        <Select value={value.status}
                            onChange={(event) => update("status", event.target.value as Conference["status"])}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </Select>
                    </label>
                </div>
                <label className="knowledge-field">
                    Official site
                    <input type="url" value={value.url} onChange={(event) => update("url", event.target.value)}
                        maxLength={2_000} required />
                </label>
                <label className="knowledge-field">
                    Location, optional
                    <input value={value.location} onChange={(event) => update("location", event.target.value)}
                        maxLength={120} />
                </label>
                <div className="knowledge-field-pair">
                    <label className="knowledge-field">
                        Starts, optional
                        <input type="date" value={value.startsOn ?? ""}
                            onChange={(event) => update("startsOn", event.target.value)} />
                    </label>
                    <label className="knowledge-field">
                        Ends, optional
                        <input type="date" value={value.endsOn ?? ""}
                            onChange={(event) => update("endsOn", event.target.value)} />
                    </label>
                </div>
                <h3 className="font-body">Deadlines</h3>
                {value.deadlines.length === 0 && (
                    <p className="knowledge-help">Leave empty until the call for papers is announced.</p>
                )}
                {value.deadlines.map((deadline, index) => (
                    <div className="deadline-editor-row" key={index}>
                        <label className="knowledge-field">
                            Label
                            <input value={deadline.label} maxLength={40} required placeholder="Paper"
                                onChange={(event) => updateDeadline(index, { label: event.target.value })} />
                        </label>
                        <label className="knowledge-field">
                            Time
                            <input type="datetime-local" value={deadline.local} required
                                onChange={(event) => updateDeadline(index, { local: event.target.value })} />
                        </label>
                        <label className="knowledge-field">
                            Time zone
                            <Select value={deadline.offset}
                                onChange={(event) => updateDeadline(index, { offset: event.target.value })}>
                                {!DEADLINE_OFFSETS.some(({ value: offset }) => offset === deadline.offset) && (
                                    <option value={deadline.offset}>UTC{deadline.offset}</option>
                                )}
                                {DEADLINE_OFFSETS.map(({ value: offset, label }) => (
                                    <option key={offset} value={offset}>{label}</option>
                                ))}
                            </Select>
                        </label>
                        <Button variant="text" size="small" onClick={() => update("deadlines",
                            value.deadlines.filter((_, current) => current !== index))}>
                            Remove
                        </Button>
                    </div>
                ))}
                {value.deadlines.length < 8 && (
                    <div>
                        <Button variant="soft" size="small" onClick={() => update("deadlines",
                            [...value.deadlines, { label: "", local: "", offset: "-12:00" }])}>
                            Add deadline
                        </Button>
                    </div>
                )}
            </fieldset>
            <div className="knowledge-save-actions">
                <Button type="submit" disabled={pending || (!create && !dirty)}>
                    {pending ? "Saving..." : create ? "Create conference" : "Save changes"}
                </Button>
                {!create && <Button variant="text" disabled={pending} onClick={remove}>Delete</Button>}
            </div>
            {error && <p role="alert">{error}</p>}
            <p role="status">{message}</p>
        </form>
    );
}
