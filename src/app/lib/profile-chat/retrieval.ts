import { profileDocuments, type ProfileDocument } from "./documents";
import type { ChatMessage } from "./validation";

const ignoredTerms = new Set([
    "about",
    "and",
    "are",
    "can",
    "could",
    "does",
    "for",
    "has",
    "have",
    "his",
    "how",
    "lim",
    "me",
    "the",
    "their",
    "them",
    "they",
    "this",
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

function scoreDocument(document: ProfileDocument, query: string) {
    const text = normalize(`${document.title} ${document.text}`);
    const title = normalize(document.title);
    const terms = [...new Set(query.match(/[\p{L}\p{N}]+/gu) ?? [])];
    const keywordScore = document.keywords.reduce((score, keyword) => score + (query.includes(keyword) ? 3 : 0), 0);
    const titleScore = query.includes(title) || query.includes(document.id) ? 12 : 0;
    const termScore = terms.reduce((score, term) => {
        if (term.length < 2 || ignoredTerms.has(term)) return score;
        return score + (title.includes(term) ? 4 : text.includes(term) ? 1 : 0);
    }, 0);

    return keywordScore + titleScore + termScore;
}

export function retrieveDocuments(question: string, history: ChatMessage[] = []) {
    const query = normalize(question);
    const previousQuestion = normalize(history.filter(({ role }) => role === "user").at(-1)?.content ?? "");
    const ranked = profileDocuments
        .map((document) => ({
            document,
            score: scoreDocument(document, query) + scoreDocument(document, previousQuestion) * 0.2,
        }))
        .filter(({ score }) => score > 0)
        .sort((first, second) => second.score - first.score);

    if (!ranked.length) {
        const overview = new Set(["profile", "eact", "mochicall", "education", "skills"]);
        return profileDocuments.filter(({ id }) => overview.has(id));
    }

    return ranked.slice(0, 6).map(({ document }) => document);
}
