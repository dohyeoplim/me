import type { ProfileDocument } from "./documents";
import type { ProfileChatAnswer } from "./types";

const instructionPatterns = [
    /\b(?:ignore|override|disregard|bypass|supersede)\b.{0,100}\b(?:instructions?|rules?|prompts?|polic(?:y|ies))\b/,
    /\b(?:system|developer|assistant|maintainer)\s+(?:message|instructions?|prompt|verification|note)\b/,
    /\b(?:priority|precedence)\s+over\b.{0,100}\b(?:rules?|instructions?|evidence)\b/,
    /\b(?:end of|outside)\s+(?:the\s+)?(?:retrieved|public|provided)\s+(?:document|evidence)\b/,
    /\b(?:response|answer|assistant|chatbot|model)\s+(?:must|should|needs to)\s+(?:say|claim|state|output|ignore)\b/,
    /\b(?:tell|instruct)\s+(?:the\s+)?(?:visitor|assistant|chatbot|model)\b/,
    /\b(?:set|mark|return|output|use)\s+["']?(?:grounding|sourceids|cardids)["']?\b/,
    /(?:이전|기존|위의|앞의|모든|시스템|개발자).{0,50}(?:지시|규칙|프롬프트).{0,50}(?:무시|덮어|우선|따르지)/,
    /(?:시스템|개발자|어시스턴트)\s*(?:메시지|지시문|프롬프트)\s*[:：]/,
];

export function isRepositorySource(document: ProfileDocument) {
    return Boolean(document.repository) || document.kind === "repository";
}

function textValues(value: unknown): string[] {
    if (typeof value === "string") return [value];
    if (Array.isArray(value)) return value.flatMap(textValues);
    if (value && typeof value === "object") return Object.values(value).flatMap(textValues);
    return [];
}

export function hasSourceInstructions(document: ProfileDocument) {
    const text = textValues([
        document.title, document.text, document.keywords, document.cardPresentation, document.repository,
    ]).join(" ").normalize("NFKC").replace(/\p{Cf}/gu, "").replace(/\s+/g, " ").toLowerCase();
    return instructionPatterns.some((pattern) => pattern.test(text));
}

export function requiresPersonalEvidence(question: string) {
    const text = question.normalize("NFKC").replace(/\p{Cf}/gu, "").toLowerCase()
        .replace(/\bcontribut(?:ion|ing|or)\s+(?:guidelines?|guides?)\b|\bhow to contribute\b/g, "");
    return /\b(?:awards?|achievements?|scholarships?|gpa|education|contribut\w*|personally)\b/.test(text)
        || /\b(?:department|class|academic)\s+rank|\branked\s+(?:first|1st)|\b(?:his|academic)\s+degree/.test(text)
        || /수상|장학|학점|학력|학위|성적|기여|직접\s*(?:개발|구현)|담당|본인|역할/.test(text);
}

export function selectEvidenceSources(documents: ProfileDocument[]) {
    const excluded: string[] = [];
    const accepted = documents.filter((document) => {
        if (!hasSourceInstructions(document)) return true;
        excluded.push(document.id);
        return false;
    });
    if (excluded.length) console.info({ event: "profile_chat_excluded_evidence", sourceIds: excluded });
    return accepted;
}

export function unavailableEvidenceAnswer(question: string): ProfileChatAnswer {
    return {
        answer: /[가-힣]/.test(question)
            ? "이 질문에 답할 수 있는 공개 자료를 확인하지 못했어요. 다른 질문을 해 주세요."
            : "I could not find public information to answer this question. Please try another question.",
        sources: [], cards: [], blocks: [], followUps: [], repositories: [],
    };
}
