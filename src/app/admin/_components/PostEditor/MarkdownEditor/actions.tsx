"use server";

import { requireAdmin } from "@/app/lib/admin-session";
import Markdown from "@/app/components/Markdown";

export async function previewMarkdown(value: string) {
    await requireAdmin();
    if (typeof value !== "string" || value.length > 100_000) throw new Error("The preview is too large.");
    return <Markdown>{value}</Markdown>;
}
