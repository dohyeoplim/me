import { notFound } from "next/navigation";
import { getEntry, getPost } from "@/app/lib/content/repository";
import Editor from "@/app/admin/_components/Editor";
import PostEditor from "@/app/admin/_components/PostEditor";

export const dynamic = "force-dynamic";

type Params = Promise<{ type: string; slug: string }>;

export default async function EditEntry({ params }: { params: Params }) {
    const { type, slug } = await params;

    if (type === "post") {
        const post = await getPost(slug);
        if (!post) notFound();
        return (
            <PostEditor
                id={post.id}
                slug={post.slug}
                title={post.title}
                status={post.status}
                doc={post.doc}
            />
        );
    }

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
