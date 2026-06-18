"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { POST_KINDS } from "@/app/lib/content/schema";
import type { PostDoc, PostKind } from "@/app/lib/content/schema";
import { savePost, deleteEntry } from "@/app/admin/actions";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import Markdown from "@/app/components/Markdown";
import SignOutButton from "./SignOutButton";
import { TextInput, TextArea } from "./Field";

type Status = "draft" | "published";

type Props = {
    id: string;
    slug: string;
    title: string;
    status: Status;
    doc: PostDoc;
};

type SaveState = "idle" | "saving" | "saved";

const KIND_LABEL: Record<PostKind, string> = {
    "paper-review": "Paper Review",
    seminar: "Seminar",
    note: "Note",
};

export default function PostEditor(props: Props) {
    const [title, setTitle] = useState(props.title);
    const [status, setStatus] = useState<Status>(props.status);
    const [doc, setDoc] = useState<PostDoc>(props.doc);
    const [baseline, setBaseline] = useState({
        title: props.title,
        status: props.status,
        doc: props.doc,
    });
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [uploading, setUploading] = useState(false);
    const saving = useRef(false);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    const dirty =
        title !== baseline.title ||
        status !== baseline.status ||
        JSON.stringify(doc) !== JSON.stringify(baseline.doc);

    const save = useCallback(async () => {
        if (saving.current || !dirty) return;
        saving.current = true;
        setSaveState("saving");
        try {
            await savePost({ id: props.id, slug: props.slug, title, status, doc });
            setBaseline({ title, status, doc });
            setSaveState("saved");
        } finally {
            saving.current = false;
        }
    }, [dirty, title, status, doc, props.id, props.slug]);

    useEffect(() => {
        if (!dirty) return;
        const t = setTimeout(save, 1200);
        return () => clearTimeout(t);
    }, [dirty, save]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [save]);

    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    const patch = (p: Partial<PostDoc>) => setDoc((d) => ({ ...d, ...p }));
    const patchPaper = (p: Partial<PostDoc["paper"]>) =>
        setDoc((d) => ({ ...d, paper: { ...d.paper, ...p } }));

    const insertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const blob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/blob/upload",
            });
            const el = bodyRef.current;
            const snippet = `![${file.name}](${blob.url})`;
            const at = el ? el.selectionStart : doc.body.length;
            const next =
                doc.body.slice(0, at) + snippet + doc.body.slice(at);
            patch({ body: next });
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const revert = () => {
        setTitle(baseline.title);
        setStatus(baseline.status);
        setDoc(baseline.doc);
    };

    const saveLabel =
        saveState === "saving" ? "Saving…" : dirty ? "Unsaved" : "Saved";

    return (
        <div className="flex flex-col gap-8">
            <HeaderActions>
                <Link
                    href="/blog"
                    onClick={(e) => {
                        if (dirty && !confirm("Discard unsaved changes?"))
                            e.preventDefault();
                    }}
                    className="font-body04-light text-grey-500"
                >
                    Blog
                </Link>
                <SignOutButton />
            </HeaderActions>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-caption01-light text-grey-400">
                        post
                    </span>
                    <div className="flex items-center gap-4 font-body04-light text-grey-500">
                        <span className="text-grey-400">{saveLabel}</span>
                        <button
                            type="button"
                            onClick={() =>
                                setStatus((s) =>
                                    s === "published" ? "draft" : "published",
                                )
                            }
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    status === "published"
                                        ? "bg-grey-800"
                                        : "bg-grey-300"
                                }`}
                            />
                            {status === "published" ? "Published" : "Draft"}
                        </button>
                        <button
                            type="button"
                            onClick={revert}
                            disabled={!dirty}
                            className="disabled:opacity-30"
                        >
                            Revert
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm("Delete this post permanently?"))
                                    deleteEntry("post", props.slug);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <input
                    value={title}
                    placeholder="Post title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border-b border-grey-200 bg-transparent pb-1 font-head01-medium text-grey-900 outline-none placeholder:text-grey-300 focus:border-grey-400"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 font-caption01-light text-grey-400">
                    kind
                    <select
                        value={doc.kind}
                        onChange={(e) =>
                            patch({ kind: e.target.value as PostKind })
                        }
                        className="w-full rounded-md border border-grey-200 bg-grey-50 px-3 py-2 font-body03-light text-grey-900 outline-none focus:border-grey-400"
                    >
                        {POST_KINDS.map((k) => (
                            <option key={k} value={k}>
                                {KIND_LABEL[k]}
                            </option>
                        ))}
                    </select>
                </label>
                <TextInput
                    label="date (YYYY-MM-DD)"
                    value={doc.date}
                    onChange={(v) => patch({ date: v })}
                />
            </div>

            <TextArea
                label="summary"
                value={doc.summary}
                onChange={(v) => patch({ summary: v })}
            />

            <TextInput
                label="tags (comma separated)"
                value={doc.tags.join(", ")}
                onChange={(v) =>
                    patch({
                        tags: v
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                    })
                }
            />

            <div className="flex flex-col gap-3">
                <span className="font-caption01-light text-grey-400">
                    paper (optional)
                </span>
                <div className="grid grid-cols-1 gap-3 border-l-2 border-grey-200 pl-4 sm:grid-cols-2">
                    <TextInput
                        label="authors"
                        value={doc.paper.authors}
                        onChange={(v) => patchPaper({ authors: v })}
                    />
                    <TextInput
                        label="venue"
                        value={doc.paper.venue}
                        onChange={(v) => patchPaper({ venue: v })}
                    />
                    <TextInput
                        label="year"
                        value={doc.paper.year}
                        onChange={(v) => patchPaper({ year: v })}
                    />
                    <TextInput
                        label="url"
                        value={doc.paper.url}
                        onChange={(v) => patchPaper({ url: v })}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between font-caption01-light text-grey-400">
                    body (markdown)
                    <label className="cursor-pointer font-body04-light text-grey-500 hover:text-grey-700">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={insertImage}
                            className="hidden"
                        />
                        {uploading ? "Uploading…" : "+ Image"}
                    </label>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <textarea
                        ref={bodyRef}
                        value={doc.body}
                        placeholder="# Write in markdown…"
                        onChange={(e) => patch({ body: e.target.value })}
                        className="min-h-[60vh] w-full resize-none rounded-md border border-grey-200 bg-grey-50 p-4 font-mono font-body04-light text-grey-900 outline-none focus:border-grey-400"
                    />
                    <div className="min-h-[60vh] overflow-auto rounded-md border border-grey-200 p-4">
                        <Markdown>{doc.body || "_Nothing yet._"}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
