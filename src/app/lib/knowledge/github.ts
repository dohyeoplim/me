import { z } from "../schema";
import { plainReadme, repositoryKnowledgeSource } from "./github-content";

export function parseRepositoryUrl(input: string) {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port) {
        throw new Error("Use a public github.com repository URL.");
    }
    const match = /^\/([a-zA-Z0-9][a-zA-Z0-9-]{0,38})\/([a-zA-Z0-9_.-]{1,100})\/?$/.exec(url.pathname);
    if (!match || url.search || url.hash || match[2] === "." || match[2] === "..") {
        throw new Error("Use a repository URL without a file path.");
    }
    return { owner: match[1]!, name: match[2]!.replace(/\.git$/, "") };
}

export async function importGitHubRepository(input: string) {
    const { owner, name } = parseRepositoryUrl(input);
    const signal = AbortSignal.timeout(12000);
    const request = async (path: string) => {
        const response = await fetch(`https://api.github.com/repos/${owner}/${name}${path}`, {
            headers: { Accept: "application/vnd.github+json" }, redirect: "error", cache: "no-store", signal,
        });
        if (!response.ok) throw new Error("Public repository could not be loaded.");
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Empty repository response.");
        const decoder = new TextDecoder();
        let text = "", bytes = 0;
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                bytes += value.byteLength;
                if (bytes > 1_000_000) {
                    await reader.cancel();
                    throw new Error("Repository response is too large.");
                }
                text += decoder.decode(value, { stream: true });
            }
            text += decoder.decode();
        } finally { reader.releaseLock(); }
        return JSON.parse(text) as unknown;
    };
    const data = z.object({
        private: z.literal(false), description: z.string().nullable(), language: z.string().nullable(),
        fork: z.boolean(), archived: z.boolean(), topics: z.array(z.string()).optional(),
        owner: z.object({ type: z.enum(["User", "Organization"]) }),
    }).parse(await request(""));
    let readme = "";
    try {
        const result = z.object({ encoding: z.literal("base64"), content: z.string().max(900_000) })
            .parse(await request("/readme"));
        readme = plainReadme(Buffer.from(result.content, "base64").toString("utf8"));
    } catch {
        if (signal.aborted) throw signal.reason;
    }
    return repositoryKnowledgeSource({
        fullName: `${owner}/${name}`, url: `https://github.com/${owner}/${name}`,
        description: (data.description ?? "").slice(0, 2000), language: data.language,
        fork: data.fork, archived: data.archived, topics: (data.topics ?? []).slice(0, 40),
        owner, ownerType: data.owner.type,
    }, readme);
}
