"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { POST_KINDS } from "@/app/lib/content/schema";
import type { PostDoc, PostKind } from "@/app/lib/content/schema";
import { savePost, deleteEntry } from "@/app/admin/actions";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import SignOutButton from "./SignOutButton";
import MarkdownEditor from "./MarkdownEditor";
import { TextArea } from "./Field";

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

const cardField =
    "-mx-2 rounded-md bg-transparent px-2 py-1 outline-none transition-colors hover:bg-grey-100 focus:bg-grey-100 placeholder:text-grey-300";

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
    const saving = useRef(false);

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

            <div className="flex items-center justify-between gap-4">
                <span className="font-caption01-light text-grey-400">post</span>
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

            <header className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3 font-caption01-light text-grey-400">
                    <select
                        value={doc.kind}
                        onChange={(e) =>
                            patch({ kind: e.target.value as PostKind })
                        }
                        className="-mx-1 rounded bg-transparent px-1 py-0.5 font-caption01-light text-grey-500 outline-none hover:bg-grey-100"
                    >
                        {POST_KINDS.map((k) => (
                            <option key={k} value={k}>
                                {KIND_LABEL[k]}
                            </option>
                        ))}
                    </select>
                    <input
                        value={doc.date}
                        placeholder="YYYY-MM-DD"
                        onChange={(e) => patch({ date: e.target.value })}
                        className="-mx-1 w-32 rounded bg-transparent px-1 py-0.5 font-caption01-light text-grey-500 outline-none hover:bg-grey-100 placeholder:text-grey-300"
                    />
                </div>

                <input
                    value={title}
                    placeholder="Untitled"
                    onChange={(e) => setTitle(e.target.value)}
                    className="-mx-2 rounded-md bg-transparent px-2 py-1 font-title02-light text-grey-900 outline-none transition-colors hover:bg-grey-100 focus:bg-grey-100 placeholder:text-grey-300"
                />

                <input
                    value={doc.tags.join(", ")}
                    placeholder="tags, comma separated"
                    onChange={(e) =>
                        patch({
                            tags: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                        })
                    }
                    className={`${cardField} font-body04-light text-grey-500`}
                />

                <div className="flex flex-col gap-2 border-l-2 border-grey-200 pl-4">
                    <input
                        value={doc.paper.authors}
                        placeholder="Authors"
                        onChange={(e) => patchPaper({ authors: e.target.value })}
                        className={`${cardField} font-body03-regular text-grey-700`}
                    />
                    <div className="flex flex-wrap items-center gap-x-2 font-body04-light text-grey-500">
                        <input
                            value={doc.paper.venue}
                            placeholder="Venue"
                            onChange={(e) =>
                                patchPaper({ venue: e.target.value })
                            }
                            className={`${cardField} flex-1 min-w-32`}
                        />
                        <input
                            value={doc.paper.year}
                            placeholder="Year"
                            onChange={(e) =>
                                patchPaper({ year: e.target.value })
                            }
                            className={`${cardField} w-20`}
                        />
                    </div>
                    <input
                        value={doc.paper.url}
                        placeholder="Paper URL"
                        onChange={(e) => patchPaper({ url: e.target.value })}
                        className={`${cardField} font-body04-light text-grey-500`}
                    />
                    <textarea
                        value={doc.summary}
                        placeholder="Abstract"
                        rows={3}
                        onChange={(e) => patch({ summary: e.target.value })}
                        className={`${cardField} resize-none font-body03-light leading-6 text-grey-500`}
                    />
                </div>
            </header>

            <TextArea
                label="description (shown in list)"
                value={doc.description}
                onChange={(v) => patch({ description: v })}
            />

            <div className="border-t border-grey-200 pt-6">
                <MarkdownEditor
                    value={doc.body}
                    onChange={(v) => patch({ body: v })}
                />
            </div>
        </div>
    );
}
