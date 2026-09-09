export function responseLanguageInstruction(question: string) {
    const text = question.replace(/(?:임)?도협\s*님?/g, "").trim();
    const englishRequested = /(?:answer|respond|reply|write)\s+in\s+english|영어로\s*(?:답|설명|소개)/i.test(text);
    const koreanRequested = /(?:answer|respond|reply|write)\s+in\s+korean|한국어로\s*(?:답|설명|소개)/i.test(text);
    if (englishRequested && !koreanRequested) {
        return "Write all generated text in English. Refer to him as Dohyeop Lim or he/him.";
    }
    if (koreanRequested && !englishRequested) {
        return "Write all generated text in Korean. Refer to him as '도협 님', never '도협 림' or '림도협'.";
    }
    if (/[가-힣]/.test(text)) {
        return "When answering in Korean, refer to him as '도협 님', never '도협 림' or '림도협'.";
    }
    return "Use Dohyeop Lim or third-person pronouns. A Korean name in the question is not a language request.";
}
