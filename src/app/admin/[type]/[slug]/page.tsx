import { notFound } from "next/navigation";
import { getEntry } from "@/app/lib/content/repository";
import Editor from "@/app/admin/_components/Editor";

export const dynamic = "force-dynamic";

type Params = Promise<{ type: string; slug: string }>;

export default async function EditEntry({ params }: { params: Params }) {
    const { type, slug } = await params;
    const entry = await getEntry(type, slug);
    if (!entry) notFound();

    return (
        <Editor
            id={entry.id}
            type={entry.type}
            slug={entry.slug}
            title={entry.title}
            status={entry.status}
            orderIndex={entry.orderIndex}
            doc={entry.doc}
        />
    );
}
