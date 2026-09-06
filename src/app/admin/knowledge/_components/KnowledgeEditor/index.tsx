"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/DDS/Button";
import type { KnowledgeEdit, KnowledgeSource } from "@/app/lib/knowledge/schema";
import { useRegisterDirty } from "../../../_components/shared/dirty";
import { archiveKnowledgeAction, saveKnowledgeAction } from "../../actions";
import { profileCardRegistry, type ProfileCardId } from "@/app/lib/profile-chat/types";
import AnswerCards from "@/app/components/ProfileChat/_components/AnswerCards";

type Props = { source: KnowledgeSource | null };

const newNote: KnowledgeEdit = {
    id: "new",
    title: "",
    text: "",
    url: "/portfolio",
    keywords: [],
    kind: "experience",
    status: "draft",
};

function editorValue(source: KnowledgeEdit) {
    return { ...source, keywordsText: source.keywords.join(", ") };
}

export default function KnowledgeEditor({ source }: Props) {
    const router = useRouter();
    const [value, setValue] = useState(() => editorValue(source ?? newNote));
    const [baseline, setBaseline] = useState(value);
    const [preview, setPreview] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();
    const dirty = JSON.stringify(value) !== JSON.stringify(baseline);
    const cardId = source?.cardId && Object.hasOwn(profileCardRegistry, source.cardId)
        ? source.cardId as ProfileCardId : null;
    useRegisterDirty(dirty);

    useEffect(() => {
        if (!dirty) return;
        const handleUnload = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [dirty]);

    const update = <K extends keyof typeof value>(key: K, next: typeof value[K]) => {
        setValue((current) => ({ ...current, [key]: next }));
        setMessage("");
        setError("");
    };

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setMessage("");
        startTransition(async () => {
            try {
                const keywords = value.keywordsText.split(",").map((keyword) => keyword.trim()).filter(Boolean);
                const input = {
                    ...value,
                    keywords: [...new Set(keywords)],
                };
                const result = await saveKnowledgeAction(input, value.id === "new");
                if (!result.ok) return setError(result.error);
                const saved = editorValue(result.value);
                setValue(saved);
                setBaseline(saved);
                const confirmation = saved.status === "published"
                    ? "Saved and available to the assistant." : "Draft saved.";
                setMessage(result.warning ?? confirmation);
                if (!source) router.replace(`/admin/knowledge?source=${encodeURIComponent(saved.id)}`);
                router.refresh();
            } catch {
                setError("Changes could not be saved. Your edits are still here. Try again.");
            }
        });
    };

    const unpublish = () => {
        if (dirty && !window.confirm("Unpublish this source and discard unsaved edits?")) return;
        setError("");
        setMessage("");
        startTransition(async () => {
            try {
                const result = await archiveKnowledgeAction(value.id);
                if (!result.ok) return setError(result.error);
                const draft = { ...baseline, status: "draft" as const };
                setValue(draft);
                setBaseline(draft);
                setMessage("Unpublished. This source is now excluded from new answers.");
                router.refresh();
            } catch {
                setError("This source could not be unpublished. Try again.");
            }
        });
    };

    return (
        <form className="knowledge-editor" onSubmit={save} aria-busy={pending}>
            <div className="knowledge-editor-heading">
                <h2 className="font-work-title">{source ? "Edit source" : "Add a source"}</h2>
                <Button variant="text" onClick={() => setPreview(!preview)} aria-pressed={preview}>
                    {preview ? "Edit" : "Preview"}
                </Button>
            </div>
            {source?.origin === "portfolio" && (
                <p className="knowledge-help">
                    Editing these facts changes future AI answers. If the text differs from the portfolio,
                    the assistant uses flexible answers in place of the original project card.
                    The portfolio page is edited separately.
                </p>
            )}
            {source?.repository && (
                <p className="knowledge-help">
                    Public repository from {source.repository.owner}.
                    This repository is managed manually.
                </p>
            )}
            {preview ? (
                <section className="knowledge-preview" aria-label="Source preview">
                    <h3 className="font-work-title">{value.title || "Untitled note"}</h3>
                    <p>{value.text || "Add the information you want the assistant to use."}</p>
                    <p className="knowledge-help">{value.url}</p>
                    <p className="knowledge-help">
                        {value.status === "published"
                            ? "Available to the assistant after saving."
                            : "Draft, not used in answers."}
                    </p>
                </section>
            ) : (
                <fieldset className="knowledge-fields" disabled={pending}>
                    <label className="knowledge-field">
                        Title
                        <input
                            value={value.title}
                            onChange={(event) => update("title", event.target.value)}
                            maxLength={200}
                            required
                        />
                    </label>
                    <label className="knowledge-field">
                        Information
                        <textarea
                            value={value.text}
                            onChange={(event) => update("text", event.target.value)}
                            maxLength={24_000}
                            required
                        />
                    </label>
                    <label className="knowledge-field">
                        Source link
                        <input
                            value={value.url}
                            onChange={(event) => update("url", event.target.value)}
                            maxLength={2_000}
                            required
                        />
                    </label>
                    <label className="knowledge-field">
                        Keywords, optional
                        <input
                            value={value.keywordsText}
                            onChange={(event) => update("keywordsText", event.target.value)}
                            placeholder="speech recognition, ASR, 음성 인식"
                        />
                    </label>
                    <div className="knowledge-field-pair">
                        <label className="knowledge-field">
                            Category
                            <select
                                value={value.kind}
                                onChange={(event) => update("kind", event.target.value as KnowledgeEdit["kind"])}
                            >
                                <option value="profile">Profile</option>
                                <option value="research">Research</option>
                                <option value="project">Project</option>
                                <option value="education">Education</option>
                                <option value="experience">Experience</option>
                                <option value="repository">Repository</option>
                            </select>
                        </label>
                        <label className="knowledge-field">
                            Visibility
                            <select
                                value={value.status}
                                onChange={(event) => update("status", event.target.value as KnowledgeEdit["status"])}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </label>
                    </div>
                </fieldset>
            )}
            {cardId && <section className="knowledge-card-editor">
                <h3 className="font-work-title">Reserved component</h3>
                <p className="knowledge-help">
                    Edit its text here. The illustration and layout stay consistent with DDS.
                </p>
                {!value.cardPresentation ? <Button variant="outline" disabled={pending} onClick={() => {
                    update("cardPresentation", {
                        enabled: true, title: value.title, description: "", body: value.text.slice(0, 2400),
                    });
                }}>Customize card</Button> : <fieldset className="knowledge-fields" disabled={pending}>
                    <label className="knowledge-selection">
                        <input type="checkbox" checked={value.cardPresentation.enabled} onChange={(event) => {
                            update("cardPresentation", { ...value.cardPresentation!, enabled: event.target.checked });
                        }} />
                        Allow this component in answers
                    </label>
                    {(["title", "description", "body"] as const).map((field) => (
                    <label className="knowledge-field" key={field}>
                        {field === "body" ? "Card content" : field === "title" ? "Card title" : "Card description"}
                        <textarea value={value.cardPresentation![field]}
                            maxLength={field === "body" ? 2400 : field === "title" ? 200 : 300}
                            required={field !== "description"} onChange={(event) => {
                                update("cardPresentation", { ...value.cardPresentation!, [field]: event.target.value });
                            }} />
                    </label>))}
                    <Button variant="text" onClick={() => update("cardPresentation", undefined)}>
                        Use default content
                    </Button>
                </fieldset>}
                {value.cardPresentation?.enabled !== false && <AnswerCards cards={[{
                    ...profileCardRegistry[cardId], presentation: value.cardPresentation,
                }]} />}
            </section>}
            <div className="knowledge-save-actions">
                <Button type="submit" disabled={pending || (value.id !== "new" && !dirty)}>
                    {pending ? "Saving..." : "Save changes"}
                </Button>
                {source && baseline.status === "published" && (
                    <Button variant="text" disabled={pending} onClick={unpublish}>Unpublish</Button>
                )}
            </div>
            {error && <p role="alert">{error}</p>}
            <p className="knowledge-help" role="status" aria-live="polite">
                {message || (dirty ? "Unsaved changes" : "")}
            </p>
        </form>
    );
}
