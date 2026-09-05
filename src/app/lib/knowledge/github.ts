import { z } from "zod";
import { includeRepository, plainReadme, repositoryKnowledgeSource } from "./github-content";
import { listKnowledgeSources, saveGitHubKnowledgeSource } from "./repository";
import type { RepositoryMetadata } from "./schema";

const githubLogin = "dohyeoplim";
const linkedOrganizations = ["Fresh-Mango-Mochi", "Collog-App", "GGUNGSIL-WONNIT", "DocFusionX"];
const loginPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/;
const repositoryNamePattern = /^[a-zA-Z0-9_.-]{1,100}$/;
const repositoryLimit = 500;
const readmeLimit = 16;
const requestLimit = 60;

const GitHubRepositorySchema = z.object({
    name: z.string().regex(repositoryNamePattern),
    description: z.string().nullable(),
    private: z.boolean(),
    fork: z.boolean(),
    archived: z.boolean(),
    language: z.string().nullable(),
    topics: z.array(z.string()).optional(),
    owner: z.object({ login: z.string().regex(loginPattern), type: z.enum(["User", "Organization"]) }),
});

export type GitHubSyncReport = {
    candidates: number;
    added: number;
    refreshed: number;
    ignoredForks: number;
    limited: boolean;
    errors: string[];
};

class GitHubRequestError extends Error {
    constructor(readonly status: number) {
        super("GitHub request failed.");
    }
}

async function mapConcurrent<T, R>(items: T[], operation: (item: T, index: number) => Promise<R>) {
    const results = new Array<R>(items.length);
    let next = 0;
    await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
        while (next < items.length) {
            const index = next++;
            results[index] = await operation(items[index], index);
        }
    }));
    return results;
}

function metadata(value: z.infer<typeof GitHubRepositorySchema>): RepositoryMetadata {
    const fullName = `${value.owner.login}/${value.name}`;
    return {
        fullName,
        url: `https://github.com/${fullName}`,
        description: (value.description ?? "").slice(0, 2_000),
        owner: value.owner.login,
        ownerType: value.owner.type,
        language: value.language,
        topics: (value.topics ?? []).slice(0, 40),
        archived: value.archived,
        fork: value.fork,
    };
}

export async function collectGitHubKnowledge() {
    let requests = 0;
    const errors: string[] = [];
    const token = process.env.GITHUB_TOKEN;
    const request = async (path: string): Promise<unknown> => {
        if (++requests > requestLimit) throw new GitHubRequestError(429);
        const response = await fetch(`https://api.github.com${path}`, {
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
            signal: AbortSignal.timeout(12_000),
        });
        if (!response.ok) throw new GitHubRequestError(response.status);
        if (Number(response.headers.get("content-length")) > 1_000_000) throw new GitHubRequestError(413);
        const body = await response.text();
        if (body.length > 1_000_000) throw new GitHubRequestError(413);
        return JSON.parse(body);
    };

    let publicOrganizations: string[] = [];
    try {
        const result = await request(`/users/${githubLogin}/orgs?per_page=100`);
        const organizations = z.array(z.object({ login: z.string().regex(loginPattern) })).parse(result);
        publicOrganizations = organizations.map(({ login }) => login);
    } catch {
        errors.push("Public membership could not be loaded. Linked project organizations were still checked.");
    }

    const organizations = [...new Map(
        [...linkedOrganizations, ...publicOrganizations].map((name) => [name.toLowerCase(), name]),
    ).values()].slice(0, 12);
    const owners = [
        { login: githubLogin, endpoint: "users" },
        ...organizations.map((login) => ({ login, endpoint: "orgs" })),
    ];
    let limited = publicOrganizations.length > organizations.length;
    const batches = await mapConcurrent(owners, async ({ login, endpoint }) => {
        const repositories: RepositoryMetadata[] = [];
        try {
            for (let page = 1; page <= 2; page++) {
                const type = endpoint === "users" ? "owner" : "public";
                const path = `/${endpoint}/${login}/repos?type=${type}&sort=updated&per_page=100&page=${page}`;
                const result = await request(path);
                const values = z.array(GitHubRepositorySchema).parse(result);
                repositories.push(...values.filter((value) => !value.private).map(metadata));
                if (values.length < 100) break;
                if (page === 2) limited = true;
            }
        } catch {
            errors.push(`Public repositories for ${login} could not be fully loaded. Try refreshing again later.`);
        }
        return repositories;
    });

    const repositories = [...new Map(batches.flat().map((item) => [item.fullName.toLowerCase(), item])).values()];
    const candidates = repositories.filter(includeRepository);
    const priority = (repository: RepositoryMetadata) => {
        if (repository.fullName.toLowerCase() === "fresh-mango-mochi/welfare-call-asr") return 0;
        if (repository.fullName.toLowerCase() === "docfusionx/server") return 0;
        return repository.ownerType === "Organization" ? 1 : 2;
    };
    const selected = candidates.sort((first, second) => priority(first) - priority(second)).slice(0, repositoryLimit);
    const sources = await mapConcurrent(selected, async (repository, index) => {
        let readme = "";
        if (index < readmeLimit) {
            try {
                const response = await request(`/repos/${repository.fullName}/readme`);
                const body = z.object({
                    encoding: z.literal("base64"), content: z.string().max(900_000),
                }).parse(response);
                readme = plainReadme(Buffer.from(body.content, "base64").toString("utf8"));
            } catch (error) {
                if (!(error instanceof GitHubRequestError) || error.status !== 404) {
                    errors.push(`README for ${repository.fullName} was unavailable. Repository details are included.`);
                }
            }
        }
        return repositoryKnowledgeSource(repository, readme);
    });

    return {
        sources,
        report: {
            candidates: candidates.length,
            ignoredForks: repositories.length - candidates.length,
            limited: limited || candidates.length > repositoryLimit,
            errors,
        },
    };
}

export async function syncGitHubKnowledge(): Promise<GitHubSyncReport> {
    const [{ sources, report }, existing] = await Promise.all([collectGitHubKnowledge(), listKnowledgeSources()]);
    const existingIds = new Set(existing.map(({ id }) => id));
    await mapConcurrent(sources, async (source) => saveGitHubKnowledgeSource(source));
    return {
        ...report,
        added: sources.filter(({ id }) => !existingIds.has(id)).length,
        refreshed: sources.filter(({ id }) => existingIds.has(id)).length,
    };
}
