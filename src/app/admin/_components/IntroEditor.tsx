"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { IntroDoc } from "@/app/lib/content/schema";
import { saveIntro } from "@/app/admin/actions";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import SignOutButton from "./SignOutButton";
import ImageField from "./ImageField";
import { TextInput, TextArea } from "./Field";

type Props = {
    doc: IntroDoc;
};

export default function IntroEditor(props: Props) {
    const [doc, setDoc] = useState(props.doc);
    const [baseline, setBaseline] = useState(props.doc);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
        "idle",
    );
    const saving = useRef(false);

    const dirty = JSON.stringify(doc) !== JSON.stringify(baseline);

    const save = useCallback(async () => {
        if (saving.current || JSON.stringify(doc) === JSON.stringify(baseline))
            return;
        saving.current = true;
        setSaveState("saving");
        try {
            await saveIntro(doc);
            setBaseline(doc);
            setSaveState("saved");
        } finally {
            saving.current = false;
        }
    }, [doc, baseline]);

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

    const setImage = (patch: Partial<IntroDoc["image"]>) =>
        setDoc((d) => ({ ...d, image: { ...d.image, ...patch } }));
    const updateLink = (i: number, patch: Partial<IntroDoc["links"][number]>) =>
        setDoc((d) => ({
            ...d,
            links: d.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)),
        }));

    const saveLabel =
        saveState === "saving" ? "Saving…" : dirty ? "Unsaved" : "Saved";

    return (
        <div className="flex flex-col gap-8">
            <HeaderActions>
                <Link href="/" className="font-body04-light text-grey-500">
                    Home
                </Link>
                <SignOutButton />
            </HeaderActions>

            <div className="flex items-center justify-between">
                <h2 className="font-head01-medium text-grey-900">Intro</h2>
                <span className="font-body04-light text-grey-400">
                    {saveLabel}
                </span>
            </div>

            <div className="flex flex-col gap-4">
                <TextInput
                    label="name"
                    value={doc.name}
                    onChange={(v) => setDoc((d) => ({ ...d, name: v }))}
                />
                <TextInput
                    label="tagline"
                    value={doc.tagline}
                    onChange={(v) => setDoc((d) => ({ ...d, tagline: v }))}
                />
                <TextInput
                    label="profile label"
                    value={doc.profileLabel}
                    onChange={(v) => setDoc((d) => ({ ...d, profileLabel: v }))}
                />
                <TextArea
                    label="bio"
                    value={doc.bio}
                    onChange={(v) => setDoc((d) => ({ ...d, bio: v }))}
                />
            </div>

            <div className="flex flex-col gap-3">
                <span className="font-caption01-light text-grey-400">links</span>
                {doc.links.map((link, i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-2 border-l-2 border-grey-200 pl-4 sm:flex-row sm:items-end"
                    >
                        <TextInput
                            label="label"
                            value={link.label}
                            onChange={(v) => updateLink(i, { label: v })}
                        />
                        <TextInput
                            label="href"
                            value={link.href}
                            onChange={(v) => updateLink(i, { href: v })}
                        />
                        <label className="flex items-center gap-1.5 pb-2 font-body04-light text-grey-500">
                            <input
                                type="checkbox"
                                checked={link.icon === "external"}
                                onChange={(e) =>
                                    updateLink(i, {
                                        icon: e.target.checked
                                            ? "external"
                                            : undefined,
                                    })
                                }
                            />
                            external
                        </label>
                        <button
                            type="button"
                            className="pb-2 font-body04-light text-grey-500"
                            onClick={() =>
                                setDoc((d) => ({
                                    ...d,
                                    links: d.links.filter((_, idx) => idx !== i),
                                }))
                            }
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="self-start rounded-md border border-grey-200 px-3 py-1.5 font-body04-light text-grey-600 hover:border-grey-400"
                    onClick={() =>
                        setDoc((d) => ({
                            ...d,
                            links: [...d.links, { label: "", href: "" }],
                        }))
                    }
                >
                    + Link
                </button>
            </div>

            <div className="flex flex-col gap-3">
                <span className="font-caption01-light text-grey-400">
                    profile image
                </span>
                <ImageField
                    url={doc.image.url}
                    alt={doc.image.alt}
                    onChange={(patch) => setImage(patch)}
                    previewClassName="h-auto w-44"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput
                        label="caption top-left"
                        value={doc.image.captionTopLeft}
                        onChange={(v) => setImage({ captionTopLeft: v })}
                    />
                    <TextInput
                        label="caption top-right"
                        value={doc.image.captionTopRight}
                        onChange={(v) => setImage({ captionTopRight: v })}
                    />
                    <TextInput
                        label="caption bottom-left"
                        value={doc.image.captionBottomLeft}
                        onChange={(v) => setImage({ captionBottomLeft: v })}
                    />
                    <TextInput
                        label="caption bottom-right"
                        value={doc.image.captionBottomRight}
                        onChange={(v) => setImage({ captionBottomRight: v })}
                    />
                </div>
            </div>
        </div>
    );
}
