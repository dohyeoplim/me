"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Block, BlockType, ContentDoc } from "@/app/lib/content/schema";
import { saveEntry } from "@/app/admin/actions";
import { createBlock } from "./blockFactory";
import { TextInput } from "./Field";
import BlockList from "./BlockList";
import AddBlockMenu from "./AddBlockMenu";
import Preview from "./Preview";

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

    const setBlocks = (blocks: Block[]) => setDoc({ ...doc, blocks });
    const addBlock = (t: BlockType) =>
        setDoc({ ...doc, blocks: [...doc.blocks, createBlock(t)] });

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

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="font-head01-medium text-grey-900">
                        {props.type} / {props.slug}
                    </h1>
                    <button
                        type="button"
                        onClick={save}
                        disabled={pending}
                        className="rounded-md bg-grey-900 px-4 py-2 text-sm text-grey-50 disabled:opacity-50"
                    >
                        {pending ? "Saving…" : "Save"}
                    </button>
                </div>
                <TextInput label="title" value={title} onChange={setTitle} />
                <BlockList blocks={doc.blocks} onChange={setBlocks} />
                <AddBlockMenu onAdd={addBlock} />
            </div>
            <div className="lg:sticky lg:top-6 lg:self-start">
                <Preview doc={doc} />
            </div>
        </div>
    );
}
