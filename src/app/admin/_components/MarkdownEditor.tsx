"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
    Bold,
    Italic,
    Heading,
    Quote,
    Code,
    List,
    Link as LinkIcon,
    Image as ImageIcon,
    Eye,
    PenLine,
} from "lucide-react";
import Markdown from "@/app/components/Markdown";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

type Mode = "write" | "preview";

export default function MarkdownEditor({ value, onChange }: Props) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [mode, setMode] = useState<Mode>("write");
    const [uploading, setUploading] = useState(false);

    const resize = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, []);

    useEffect(() => {
        if (mode === "write") resize();
    }, [value, mode, resize]);

    const replaceRange = (start: number, end: number, text: string, caret: number) => {
        const next = value.slice(0, start) + text + value.slice(end);
        onChange(next);
        requestAnimationFrame(() => {
            const el = ref.current;
            if (!el) return;
            el.focus();
            el.selectionStart = caret;
            el.selectionEnd = caret;
        });
    };

    const surround = (before: string, after = before) => {
        const el = ref.current;
        if (!el) return;
        const { selectionStart: s, selectionEnd: e } = el;
        const selected = value.slice(s, e);
        const text = before + selected + after;
        replaceRange(s, e, text, e + before.length + after.length);
    };

    const prefixLine = (prefix: string) => {
        const el = ref.current;
        if (!el) return;
        const { selectionStart: s } = el;
        const lineStart = value.lastIndexOf("\n", s - 1) + 1;
        replaceRange(lineStart, lineStart, prefix, s + prefix.length);
    };

    const insertLink = () => {
        const el = ref.current;
        if (!el) return;
        const { selectionStart: s, selectionEnd: e } = el;
        const selected = value.slice(s, e) || "text";
        const text = `[${selected}](url)`;
        replaceRange(s, e, text, s + text.length - 1);
    };

    const insertImage = (alt: string, url: string) => {
        const el = ref.current;
        const at = el ? el.selectionStart : value.length;
        const snippet = `![${alt}](${url})`;
        replaceRange(at, at, snippet, at + snippet.length);
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const blob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/blob/upload",
            });
            insertImage(file.name, blob.url);
        } finally {
            setUploading(false);
        }
    };

    const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await uploadFile(file);
        e.target.value = "";
    };

    const onPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const file = Array.from(e.clipboardData.files).find((f) =>
            f.type.startsWith("image/"),
        );
        if (file) {
            e.preventDefault();
            await uploadFile(file);
        }
    };

    const onDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
        const file = Array.from(e.dataTransfer.files).find((f) =>
            f.type.startsWith("image/"),
        );
        if (file) {
            e.preventDefault();
            await uploadFile(file);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!(e.metaKey || e.ctrlKey)) return;
        const key = e.key.toLowerCase();
        if (key === "b") {
            e.preventDefault();
            surround("**");
        } else if (key === "i") {
            e.preventDefault();
            surround("_");
        }
    };

    const tools = [
        { icon: Heading, label: "Heading", run: () => prefixLine("## ") },
        { icon: Bold, label: "Bold", run: () => surround("**") },
        { icon: Italic, label: "Italic", run: () => surround("_") },
        { icon: Quote, label: "Quote", run: () => prefixLine("> ") },
        { icon: List, label: "List", run: () => prefixLine("- ") },
        { icon: Code, label: "Code", run: () => surround("`") },
        { icon: LinkIcon, label: "Link", run: insertLink },
    ];

    return (
        <div className="flex flex-col">
            <div className="sticky top-16 md:top-28 z-10 mb-4 flex justify-end">
                <div className="flex items-center gap-0.5 rounded-lg border border-grey-200 bg-grey-50 px-1 py-1">
                    {uploading && (
                        <span className="px-1.5 font-body05-light text-grey-400">
                            Uploading…
                        </span>
                    )}
                    {tools.map((t) => (
                        <button
                            key={t.label}
                            type="button"
                            title={t.label}
                            onClick={t.run}
                            disabled={mode === "preview"}
                            className="rounded-md p-1.5 text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900 disabled:opacity-30"
                        >
                            <t.icon size={16} strokeWidth={1.75} />
                        </button>
                    ))}
                    <label
                        title="Image"
                        className="rounded-md p-1.5 text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onPick}
                            className="hidden"
                        />
                        <ImageIcon size={16} strokeWidth={1.75} />
                    </label>
                    <span className="mx-1 h-4 w-px bg-grey-200" />
                    <button
                        type="button"
                        title={mode === "write" ? "Preview" : "Write"}
                        onClick={() =>
                            setMode((m) => (m === "write" ? "preview" : "write"))
                        }
                        className="rounded-md p-1.5 text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-900"
                    >
                        {mode === "write" ? (
                            <Eye size={16} strokeWidth={1.75} />
                        ) : (
                            <PenLine size={16} strokeWidth={1.75} />
                        )}
                    </button>
                </div>
            </div>

            {mode === "write" ? (
                <textarea
                    ref={ref}
                    value={value}
                    placeholder="Write…"
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onPaste={onPaste}
                    onDrop={onDrop}
                    spellCheck={false}
                    className="-mx-2 min-h-[60vh] w-full resize-none overflow-hidden bg-transparent px-2 font-body02-light leading-7 text-grey-800 outline-none placeholder:text-grey-300"
                />
            ) : (
                <div className="min-h-[60vh]">
                    <Markdown>{value || "_Nothing yet._"}</Markdown>
                </div>
            )}
        </div>
    );
}
