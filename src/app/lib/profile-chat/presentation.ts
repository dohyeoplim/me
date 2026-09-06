import type { ProfileDocument } from "./documents";
import type { ProfileAnswerBlock, ProfileCardId } from "./types";
import { isRepositorySource } from "./evidence";

export type AnswerPresentation = ProfileAnswerBlock["type"] | null;

export function answerPresentation(
    question: string, documents: ProfileDocument[], shownCardIds: ProfileCardId[] = [],
): AnswerPresentation {
    const query = question.normalize("NFKC").toLowerCase();
    const textOnly = /text.only|no (?:cards|blocks|visuals)|one sentence|just (?:the|his)|텍스트만|한\s*문장|점수만/;
    if (textOnly.test(query)) {
        return null;
    }
    const evidence = documents.filter((document) => !isRepositorySource(document));
    if (!evidence.length) return null;
    const has = (id: string) => evidence.some((document) => document.id === id);
    const singleFact = /how many|what.{0,15}(?:score|gpa)|when|몇\s*(?:점|개|명)|학점|점수|언제/.test(query);
    if (singleFact && !/background|overview|compare|비교|소개|학력/.test(query)) return null;
    if (/compar|difference|비교|차이/.test(query) && evidence.length >= 2) return "comparison";
    if (/timeline|chronolog|연대|타임라인/.test(query)) return "timeline";
    const community = /outside (?:the )?lab|communit|leadership|동아리|커뮤니티|연구실\s*밖/;
    if (has("community") && community.test(query)) {
        return "comparison";
    }
    const education = /education|academic background|where.{0,20}stud|학력|학업|교육\s*배경/;
    if (has("education") && education.test(query)) {
        return "facts";
    }
    const skills = /skills|which.{0,30}(?:languages|tools)|기술\s*스택|어떤.{0,15}(?:언어|도구)/;
    if (has("skills") && skills.test(query)) {
        return "facts";
    }
    const shownProject = evidence.some((document) => document.kind === "project" &&
        shownCardIds.includes((document.cardId ?? document.id) as ProfileCardId));
    if (shownProject && /more|detail|pipeline|process|works?|자세|과정|단계|원리/.test(query)) {
        return /pipeline|process|works?|과정|단계|원리/.test(query) ? "steps" : "facts";
    }
    return null;
}

export function presentationInstruction(presentation: AnswerPresentation) {
    if (!presentation) return "";
    return `For a supported answer, use one ${presentation} block with the documented details. ` +
        "Write the block first. Then write just one short introductory sentence for answer, " +
        "under 30 English words or 120 Korean characters, with a complete ending. " +
        "Put names, roles, dates, scores, methods, and awards in the block instead of repeating them in prose. " +
        "For community comparisons, use organizations as columns. " +
        "Use role, participation period, and activity as rows. " +
        "Membership dates are not role start dates. Event editions are not competition rankings. " +
        "Project periods are not data collection dates. Include only explicitly documented processing steps. " +
        "Do not infer either from the other. " +
        "If there are not enough relevant facts, return unsupported with no visual items.";
}

export function visualSummary(answer: string) {
    const segmenter = new Intl.Segmenter(/[가-힣]/.test(answer) ? "ko" : "en", { granularity: "sentence" });
    let summary = "";
    for (const { segment } of segmenter.segment(answer.trim())) {
        summary += segment;
        if (!/\b(?:prof|dr|mr|mrs|ms|sr|jr|st|e\.g|i\.e)\.$/i.test(summary.trim())) break;
    }
    return summary.trim() || answer;
}
