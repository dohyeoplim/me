import { profileDocuments, type ProfileDocument } from "./documents";
import { profileCardRegistry } from "./types";
import type { ChatMessage } from "./validation";

const ignoredTerms = new Set([
    "about",
    "also",
    "and",
    "are",
    "at",
    "can",
    "could",
    "did",
    "do",
    "does",
    "for",
    "from",
    "has",
    "have",
    "his",
    "how",
    "in",
    "is",
    "it",
    "lim",
    "me",
    "more",
    "of",
    "on",
    "please",
    "tell",
    "the",
    "that",
    "their",
    "them",
    "these",
    "they",
    "this",
    "those",
    "to",
    "use",
    "used",
    "was",
    "were",
    "what",
    "when",
    "where",
    "which",
    "who",
    "with",
    "you",
    "your",
    "dohyeop",
]);

function normalize(text: string) {
    return text.normalize("NFKC").toLowerCase();
}

function queryTerms(query: string) {
    return [...new Set(query.match(/[\p{L}\p{N}]+/gu) ?? [])]
        .filter((term) => term.length >= 2 && !ignoredTerms.has(term));
}

const repositoryTerms = new Set([
    "github", "repository", "repositories", "repo", "repos", "explore", "recommend", "recommended", "should",
    "look", "show", "code", "source", "project", "projects", "some", "interesting", "browse", "related", "work",
    "관련", "추천", "저장소", "프로젝트", "코드",
]);

function asksForRepositories(query: string) {
    return /github|repositor|\brepos?\b|\bcode\b|저장소|깃허브|코드/.test(query);
}

function projectLinkWeight(repository: NonNullable<ProfileDocument["repository"]>, source: ProfileDocument) {
    const sourceUrl = normalize(source.url).replace(/\/+$/, "");
    if (sourceUrl === normalize(repository.url)) return 20;
    if (sourceUrl === `https://github.com/${normalize(repository.owner)}`) return 12;
    const card = Object.hasOwn(profileCardRegistry, source.id)
        ? profileCardRegistry[source.id as keyof typeof profileCardRegistry]
        : null;
    if (![source.kind, card?.type].some((kind) => kind === "research" || kind === "project")) return 0;
    const compact = (value: string) => normalize(value).replace(/[^\p{L}\p{N}]/gu, "");
    return compact(repository.fullName.split("/")[1]) === compact(source.title) ? 8 : 0;
}

function repositoryPriority(
    document: ProfileDocument,
    query: string,
    previousQuestion: string,
    context: Set<string>,
    links: { document: ProfileDocument; weight: number }[],
) {
    const repository = document.repository;
    if (!repository) return 0;
    const name = normalize(repository.fullName.split("/")[1]);
    const support = name === ".github" || /(?:^|[-_])(privacy|policy|terms|admin)(?:$|[-_])/.test(name);
    const explicit = query.includes(name) || /\b(privacy|policy|terms|admin)\b|개인정보|관리자/.test(query);
    const penalty = support && !explicit ? -30 : 0;
    if (!asksForRepositories(query)) return penalty;

    const topic = queryTerms(query).filter((term) => !repositoryTerms.has(term)).join(" ");
    const previousTopic = queryTerms(previousQuestion).filter((term) => !repositoryTerms.has(term)).join(" ");
    const bonus = Math.max(0, ...links.map(({ document: source, weight }) => {
        const relevant = topic ? scoreDocument(source, topic) > 0
            : context.size ? context.has(source.id)
                : !previousTopic || scoreDocument(source, previousTopic) > 0;
        return relevant ? weight : 0;
    }));
    return bonus + penalty;
}

function scoreDocument(document: ProfileDocument, query: string) {
    const text = normalize(`${document.title} ${document.text}`);
    const title = normalize(document.title);
    const terms = queryTerms(query);
    const keywordScore = document.keywords.reduce((score, keyword) => {
        return score + (query.includes(normalize(keyword)) ? 3 : 0);
    }, 0);
    const titleScore = query.includes(title) || query.includes(document.id) ? 12 : 0;
    const termScore = terms.reduce((score, term) => {
        return score + (title.includes(term) ? 4 : text.includes(term) ? 1 : 0);
    }, 0);

    return keywordScore + titleScore + termScore;
}

export function excerptDocument(document: ProfileDocument, question: string, history: ChatMessage[] = []) {
    if (document.text.length <= 10000) return document.text;

    const terms = queryTerms(normalize(question));
    const previous = history.filter(({ role }) => role === "user").at(-1)?.content ?? "";
    const contextTerms = queryTerms(normalize(previous));
    const windows = Array.from({ length: Math.ceil(document.text.length / 1800) }, (_, index) => {
        const start = index * 1800;
        const end = Math.min(start + 2400, document.text.length);
        const passage = normalize(document.text.slice(start, end));
        const score = terms.reduce((total, term) => total + Number(passage.includes(term)), 0)
            + contextTerms.reduce((total, term) => total + Number(passage.includes(term)) * 0.2, 0);
        return { start, end, score };
    });
    const matches = windows.slice(1)
        .filter(({ score }) => score > 0)
        .sort((first, second) => second.score - first.score);
    if (!matches.length) return document.text.slice(0, 10000);
    const selected = [windows[0], ...matches.slice(0, 3)].sort((first, second) => first.start - second.start);
    const ranges = selected.reduce<{ start: number; end: number }[]>((result, range) => {
        const previous = result.at(-1);
        if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
        else result.push({ start: range.start, end: range.end });
        return result;
    }, []);
    return ranges.map(({ start, end }) => document.text.slice(start, end)).join("\n\n…\n\n");
}

export function retrieveDocuments(
    question: string,
    history: ChatMessage[] = [],
    documents: ProfileDocument[] = profileDocuments,
    contextSourceIds: string[] = [],
) {
    const query = normalize(question);
    const previousQuestion = normalize(history.filter(({ role }) => role === "user").at(-1)?.content ?? "");
    const context = new Set(contextSourceIds);
    const profiles = documents.filter(({ repository }) => !repository);
    const links = new Map(documents.filter(({ repository }) => repository).map((document) => [
        document.id,
        profiles.map((source) => ({ document: source, weight: projectLinkWeight(document.repository!, source) }))
            .filter(({ weight }) => weight > 0),
    ]));
    const ranked = documents
        .map((document) => ({
            document,
            score: scoreDocument(document, query)
                + scoreDocument(document, previousQuestion) * 0.2
                + (context.has(document.id) ? 2 : 0)
                + repositoryPriority(document, query, previousQuestion, context, links.get(document.id) ?? []),
        }))
        .filter(({ score, document }) => score > 0 || context.has(document.id))
        .sort((first, second) => {
            return Number(context.has(second.document.id)) - Number(context.has(first.document.id))
                || second.score - first.score;
        });

    if (!ranked.length) {
        const overview = new Set(["profile", "eact", "mochicall", "education", "skills"]);
        const selected = documents.filter(({ id }) => overview.has(id));
        return (selected.length ? selected : documents).slice(0, 6);
    }

    const repositories = ranked.filter(({ document }) => document.repository).slice(0, 3);
    const repositoryIds = new Set(repositories.map(({ document }) => document.id));
    const candidates = asksForRepositories(query) ? [
        ...ranked.filter(({ document }) => context.has(document.id)),
        ...repositories,
        ...repositories.flatMap(({ document }) => links.get(document.id) ?? []),
        ...ranked,
    ] : ranked;
    const selected = candidates.filter(({ document }) => !document.repository || repositoryIds.has(document.id));
    return [...new Map(selected.map(({ document }) => [document.id, document])).values()]
        .slice(0, 6);
}
