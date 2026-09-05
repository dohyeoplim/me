import { createHash } from "node:crypto";
import type { KnowledgeSource, RepositoryMetadata } from "./schema";

const coreRepositories = new Set(["fresh-mango-mochi/welfare-call-asr", "docfusionx/server"]);

export function repositorySourceId(fullName: string) {
    return `github-${createHash("sha256").update(fullName.toLowerCase()).digest("hex").slice(0, 20)}`;
}

export function includeRepository(repository: Pick<RepositoryMetadata, "fullName" | "fork">) {
    return !repository.fork || coreRepositories.has(repository.fullName.toLowerCase());
}

export function plainReadme(markdown: string) {
    return markdown
        .replace(/```[^\n]*\n[\s\S]*?(?:```|$)/g, " ")
        .replace(/~~~[^\n]*\n[\s\S]*?(?:~~~|$)/g, " ")
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
        .replace(/<!--([\s\S]*?)-->/g, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/^[\t ]*(?:#{1,6}|>|[-*+]\s|\d+\.\s)/gm, "")
        .replace(/[`*_~]/g, "")
        .replace(/&(?:nbsp|amp|lt|gt|quot);/g, " ")
        .replace(/[\t ]+/g, " ")
        .replace(/\n\s*\n+/g, "\n\n")
        .trim()
        .slice(0, 6_000);
}

export function repositoryKnowledgeSource(repository: RepositoryMetadata, readme: string): KnowledgeSource {
    const attribution = repository.ownerType === "Organization"
        ? "This is a public repository from a related organization. Organization membership alone does not establish "
            + "Dohyeop Lim's personal contribution. Use his project notes to describe his role."
        : "This is a public repository from Dohyeop Lim's GitHub account. "
            + "The description and README describe the repository, not independently verified contributions.";
    return {
        id: repositorySourceId(repository.fullName),
        title: repository.fullName,
        text: [repository.description, attribution, readme].filter(Boolean).join("\n\n"),
        url: repository.url,
        keywords: [...new Set([
            ...repository.fullName.split("/"),
            ...repository.topics,
            repository.language ?? "",
            "github",
            "repository",
            "repo",
            "저장소",
        ].filter(Boolean))].slice(0, 50),
        kind: "repository",
        status: "published",
        cardId: null,
        origin: "github",
        repository,
    };
}
