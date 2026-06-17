"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ContentDoc } from "@/app/lib/content/schema";
import { saveEntry, deleteEntry } from "@/app/admin/actions";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import SignOutButton from "./SignOutButton";
import Canvas from "./Canvas";

type Props = {
    id: string;
    type: string;
    slug: string;
    title: string;
    status: "draft" | "published";
    orderIndex: number;
    doc: ContentDoc;
};

export default function Editor(props: Props) {
    const router = useRouter();
    const [title, setTitle] = useState(props.title);
    const [doc, setDoc] = useState<ContentDoc>(props.doc);
    const [pending, startTransition] = useTransition();

    const dirty =
        title !== props.title ||
        JSON.stringify(doc) !== JSON.stringify(props.doc);

    const save = () =>
        startTransition(async () => {
            await saveEntry({
                id: props.id,
                type: props.type,
                slug: props.slug,
                title,
                status: props.status,
                orderIndex: props.orderIndex,
                doc,
            });
            router.push("/admin");
        });

    const revert = () => {
        setTitle(props.title);
        setDoc(props.doc);
    };

    const remove = () =>
        startTransition(async () => {
            await deleteEntry(props.type, props.slug);
        });

    return (
        <div className="flex flex-col gap-10">
            <HeaderActions>
                <button
                    type="button"
                    onClick={save}
                    disabled={pending}
                    className="rounded-md bg-grey-900 px-4 py-2 font-body04-light text-grey-50 disabled:opacity-50"
                >
                    {pending ? "Saving…" : "Save"}
                </button>
                <SignOutButton />
            </HeaderActions>

            <div className="flex flex-col gap-2">
                <span className="font-caption01-light text-grey-400">
                    {props.type} / {props.slug}
                </span>
                <div className="flex items-end justify-between gap-4 border-b border-grey-200 focus-within:border-grey-400">
                    <input
                        value={title}
                        placeholder="Entry title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent pb-1 font-head01-medium text-grey-900 outline-none placeholder:text-grey-300"
                    />
                    <div className="flex shrink-0 items-center gap-4 pb-1.5 font-body04-light text-grey-500">
                        <button
                            type="button"
                            onClick={revert}
                            disabled={!dirty || pending}
                            className="disabled:opacity-30"
                        >
                            Revert
                        </button>
                        <button
                            type="button"
                            disabled={pending}
                            className="disabled:opacity-30"
                            onClick={() => {
                                if (confirm("Delete this section permanently?"))
                                    remove();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <Canvas doc={doc} onChange={setDoc} />
        </div>
    );
}
