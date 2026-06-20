"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ContentDoc } from "@/app/lib/content/schema";
import { saveEntry, deleteEntry } from "@/app/admin/actions";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import SignOutButton from "../shared/SignOutButton";
import ExitLink from "../shared/ExitLink";
import { useRegisterDirty } from "../shared/dirty";
import Canvas from "./Canvas";

type Status = "draft" | "published";

type Props = {
    id: string;
    type: string;
    slug: string;
    title: string;
    status: Status;
    orderIndex: number;
    doc: ContentDoc;
};

type SaveState = "idle" | "saving" | "saved";

export default function Editor(props: Props) {
    const [title, setTitle] = useState(props.title);
    const [status, setStatus] = useState<Status>(props.status);
    const [doc, setDoc] = useState<ContentDoc>(props.doc);
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

    useRegisterDirty(dirty);

    const save = useCallback(async () => {
        if (saving.current || !dirty) return;
        saving.current = true;
        setSaveState("saving");
        try {
            await saveEntry({
                id: props.id,
                type: props.type,
                slug: props.slug,
                title,
                status,
                orderIndex: props.orderIndex,
                doc,
            });
            setBaseline({ title, status, doc });
            setSaveState("saved");
        } finally {
            saving.current = false;
        }
    }, [dirty, title, status, doc, props]);

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

    const revert = () => {
        setTitle(baseline.title);
        setStatus(baseline.status);
        setDoc(baseline.doc);
    };

    const remove = () => deleteEntry(props.type, props.slug);

    const saveLabel =
        saveState === "saving" ? "Saving…" : dirty ? "Unsaved" : "Saved";

    return (
        <div className="flex flex-col gap-10">
            <HeaderActions>
                <ExitLink />
                <SignOutButton />
            </HeaderActions>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-caption01-light text-grey-400">
                        {props.type}
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
                                if (confirm("Delete this section permanently?"))
                                    remove();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <input
                    value={title}
                    placeholder="Entry title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border-b border-grey-200 bg-transparent pb-1 font-head01-medium text-grey-900 outline-none placeholder:text-grey-300 focus:border-grey-400"
                />
            </div>

            <Canvas doc={doc} onChange={setDoc} />
        </div>
    );
}
