import fs from "node:fs/promises";
import path from "node:path";
import type { ContentDoc } from "@/app/components/ContentRenderer/types";

export async function loadContentDoc(relPath: string): Promise<ContentDoc> {
    const full = path.join(process.cwd(), "content", relPath);
    const raw = await fs.readFile(full, "utf-8");
    return JSON.parse(raw) as ContentDoc;
}
