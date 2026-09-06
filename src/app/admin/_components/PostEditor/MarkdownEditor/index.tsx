"use client";

import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
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
import { imageUploadError, imageUploadTypes } from "@/app/lib/uploads";
import { previewMarkdown } from "./actions";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

type Mode = "write" | "preview";

const tools = [
    { icon: Heading, label: "Heading" },
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Quote, label: "Quote" },
    { icon: List, label: "List" },
    { icon: Code, label: "Code" },
    { icon: LinkIcon, label: "Link" },
] as const;

export default function MarkdownEditor({ value, onChange }: Props) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [mode, setMode] = useState<Mode>("write");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<ReactNode>(null);
    const [previewPending, startPreview] = useTransition();

    function toggleMode() {
        if (mode === "preview") return setMode("write");
        setMode("preview");
        startPreview(async () => {
            try {
                setPreview(await previewMarkdown(value));
            } catch {
                setPreview(<p role="alert">The preview could not be loaded. Return to writing and try again.</p>);
            }
        });
    }

    const resize = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        const scrollY = window.scrollY;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        window.scrollTo(0, scrollY);
    }, []);

    useEffect(() => {
        if (mode === "write") resize();
    }, [value, mode, resize]);

    const replaceRange = (start: number, end: number, text: string, caret: number) => {
        const base = ref.current ? ref.current.value : value;
        const scrollY = window.scrollY;
        const next = base.slice(0, start) + text + base.slice(end);
        onChange(next);
        requestAnimationFrame(() => {
            const el = ref.current;
            if (!el) return;
            el.focus({ preventScroll: true });
            el.selectionStart = caret;
            el.selectionEnd = caret;
            window.scrollTo(0, scrollY);
        });
    };

    const surround = (before: string, after = before) => {
        const el = ref.current;
        if (!el) return;
        const { selectionStart: s, selectionEnd: e } = el;
        const selected = value.slice(s, e);
        const text = before + selected + after;
        const caret =
            s === e ? s + before.length : e + before.length + after.length;
        replaceRange(s, e, text, caret);
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

    const uploadFiles = async (files: File[], at?: number) => {
        const images = files.filter((f) => f.type.startsWith("image/"));
        if (images.length === 0) return;
        const validationError = images.map(imageUploadError).find(Boolean) ?? null;
        setError(validationError);
        if (validationError) return;
        setUploading(true);
        try {
            const uploaded = await Promise.all(
                images.map(async (file) => {
                    const blob = await upload(file.name, file, {
                        access: "public",
                        handleUploadUrl: "/api/blob/upload",
                    });
                    return `![${file.name}](${blob.url})`;
                }),
            );
            const snippet = uploaded.join("\n\n");
            const el = ref.current;
            const pos = at ?? (el ? el.selectionStart : value.length);
            replaceRange(pos, pos, snippet, pos + snippet.length);
        } catch {
            setError("The images could not be uploaded. Try again.");
        } finally {
            setUploading(false);
        }
    };

    const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        await uploadFiles(files);
    };

    const onPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const images = Array.from(e.clipboardData.files).filter((f) =>
            f.type.startsWith("image/"),
        );
        if (images.length > 0) {
            e.preventDefault();
            await uploadFiles(images);
        }
    };

    const caretIndexAt = (x: number, y: number): number | null => {
        const d = document as unknown as {
            caretPositionFromPoint?: (
                x: number,
                y: number,
            ) => { offset: number } | null;
            caretRangeFromPoint?: (x: number, y: number) => Range | null;
        };
        const pos = d.caretPositionFromPoint?.(x, y);
        if (pos) return pos.offset;
        const range = d.caretRangeFromPoint?.(x, y);
        if (range) return range.startOffset;
        return null;
    };

    const onDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
        const images = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/"),
        );
        if (images.length === 0) return;
        e.preventDefault();
        const idx = caretIndexAt(e.clientX, e.clientY);
        const at = idx ?? ref.current?.selectionStart;
        await uploadFiles(images, at ?? undefined);
    };

    const handleListEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const el = ref.current;
        if (!el || el.selectionStart !== el.selectionEnd) return;
        const s = el.selectionStart;
        const lineStart = value.lastIndexOf("\n", s - 1) + 1;
        const line = value.slice(lineStart, s);
        const unordered = line.match(/^(\s*)([-*+]) (.*)$/);
        const ordered = line.match(/^(\s*)(\d+)\. (.*)$/);
        if (!unordered && !ordered) return;
        e.preventDefault();
        const indent = (unordered ?? ordered)?.[1] ?? "";
        const content = (unordered ?? ordered)?.[3] ?? "";
        if (content.trim() === "") {
            replaceRange(lineStart, s, "", lineStart);
            return;
        }
        const marker = unordered
            ? `${unordered[2]} `
            : `${parseInt(ordered?.[2] ?? "0", 10) + 1}. `;
        const insert = `\n${indent}${marker}`;
        replaceRange(s, s, insert, s + insert.length);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.nativeEvent.isComposing) return;
        if (
            e.key === "Enter" &&
            !e.shiftKey &&
            !e.metaKey &&
            !e.ctrlKey &&
            !e.altKey
        ) {
            handleListEnter(e);
            return;
        }
        if (e.metaKey || e.ctrlKey) {
            const key = e.key.toLowerCase();
            if (key === "b") {
                e.preventDefault();
                surround("**");
            } else if (key === "i") {
                e.preventDefault();
                surround("_");
            }
        }
    };

    function runTool(label: (typeof tools)[number]["label"]) {
        switch (label) {
            case "Heading": return prefixLine("## ");
            case "Bold": return surround("**");
            case "Italic": return surround("_");
            case "Quote": return prefixLine("> ");
            case "List": return prefixLine("- ");
            case "Code": return surround("`");
            case "Link": return insertLink();
        }
    }

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
                            onClick={() => runTool(t.label)}
                            disabled={mode === "preview"}
                            className={
                                "rounded-md p-1.5 text-grey-500 transition-colors hover:bg-grey-100 " +
                                "hover:text-grey-900 disabled:opacity-30"
                            }
                        >
                            <t.icon size={16} strokeWidth={1.75} />
                        </button>
                    ))}
                    <label
                        title="Image"
                        className={
                            "rounded-md p-1.5 text-grey-500 transition-colors hover:bg-grey-100 " +
                            "hover:text-grey-900"
                        }
                    >
                        <input
                            type="file"
                            accept={imageUploadTypes.join(",")}
                            multiple
                            onChange={onPick}
                            className="hidden"
                        />
                        <ImageIcon size={16} strokeWidth={1.75} />
                    </label>
                    <span className="mx-1 h-4 w-px bg-grey-200" />
                    <button
                        type="button"
                        title={mode === "write" ? "Preview" : "Write"}
                        onClick={toggleMode}
                        className={
                            "rounded-md p-1.5 text-grey-500 transition-colors hover:bg-grey-100 " +
                            "hover:text-grey-900"
                        }
                    >
                        {mode === "write" ? (
                            <Eye size={16} strokeWidth={1.75} />
                        ) : (
                            <PenLine size={16} strokeWidth={1.75} />
                        )}
                    </button>
                </div>
            </div>

            {error && <p className="font-support text-ink" role="alert">{error}</p>}
            {mode === "write" ? (
                <textarea
                    ref={ref}
                    value={value}
                    placeholder="Write…"
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    onPaste={onPaste}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    spellCheck={false}
                    className={
                        "-mx-2 min-h-[60vh] w-full resize-none overflow-hidden bg-transparent px-2 " +
                        "font-body02-light leading-7 text-grey-800 outline-none placeholder:text-grey-300"
                    }
                />
            ) : (
                <div className="min-h-[60vh]">
                    {previewPending ? <p className="font-support" role="status">Loading preview…</p> : preview}
                </div>
            )}
        </div>
    );
}
