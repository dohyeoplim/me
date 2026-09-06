import type { ProfileChatAnswer, ProfileFollowUp } from "../../../lib/profile-chat/types";

export const suggestedQuestions: ProfileFollowUp[] = [
    {
        label: "What are you researching?",
        question: "What are you currently researching?",
        sourceIds: ["profile", "eact", "industrial-ocr", "kraftbox", "table-recognition"],
    },
    {
        label: "Which projects use speech recognition?",
        question: "Which projects use speech recognition?",
        sourceIds: ["mochicall", "collog"],
    },
    { label: "How does E-ACT work?", question: "How does E-ACT work?", sourceIds: ["eact"] },
    { label: "What have you built for iPhone?", question: "What have you built for iPhone?", sourceIds: ["wonnit"] },
    {
        label: "Where have you studied?",
        question: "What is your education and academic background?",
        sourceIds: ["education"],
    },
    {
        label: "What was your work in Germany?",
        question: "What did you work on during your visiting program in Germany?",
        sourceIds: ["international-experience", "docfusionx"],
    },
    {
        label: "What do you do outside the lab?",
        question: "What do you do outside the lab?",
        sourceIds: ["community", "infrastructure"],
    },
    { label: "Show me project repositories", question: "Which GitHub repositories should I explore?", sourceIds: [] },
    {
        label: "How do you evaluate training data?",
        question: "What have you learned about synthetic training data and model evaluation?",
        sourceIds: ["industrial-ocr", "kraftbox", "research-interests"],
    },
    {
        label: "How do you support other researchers?",
        question: "How do you support shared GPU infrastructure and other researchers?",
        sourceIds: ["infrastructure"],
    },
    {
        label: "Which tools do you use?",
        question: "Which programming languages and tools do you use?",
        sourceIds: ["skills"],
    },
    {
        label: "What do you want to research next?",
        question: "What are your future research interests?",
        sourceIds: ["research-interests"],
    },
];

const projectNames = new Map([
    ["eact", "E-ACT"],
    ["collog", "Collog"],
    ["mochicall", "MochiCall"],
    ["wonnit", "WONNIT"],
    ["docfusionx", "DocFusionX"],
]);

export function followUpQuestions(answer: ProfileChatAnswer, previousQuestions: string[]): ProfileFollowUp[] {
    const previous = new Set(previousQuestions.map((question) => question.trim().toLowerCase()));
    const context = answer.sources.map(({ id }) => id);
    const projects = answer.cards.flatMap(({ id }) => {
        const name = projectNames.get(id);
        return name ? [{ name, id }] : [];
    });
    const coveredProjects = new Set(answer.followUps.flatMap(({ sourceIds }) => (
        sourceIds.length === 1 && projectNames.has(sourceIds[0] ?? "") ? sourceIds : []
    )));
    const contextual = projects
        .filter(({ id }) => !coveredProjects.has(id))
        .map(({ name, id }) => ({
            label: `More about ${name}`,
            question: `Tell me more about ${name}, including your specific contributions.`,
            sourceIds: [id],
        }));
    const related = context.length > 0 ? [{
        label: "Explore related repositories",
        question: "Show me repositories related to this work.",
        sourceIds: context,
    }] : [];
    const candidates = [...answer.followUps, ...contextual, ...related];
    const seen = new Set<string>();
    const seenLabels = new Set<string>();

    return candidates.filter(({ label, question }) => {
        const key = question.trim().toLowerCase();
        const labelKey = label.trim().toLowerCase();
        if (previous.has(key) || seen.has(key) || seenLabels.has(labelKey)) return false;
        seen.add(key);
        seenLabels.add(labelKey);
        return true;
    }).slice(0, 4);
}

export function explorationQuestions(answer: ProfileChatAnswer, previousQuestions: string[]): ProfileFollowUp[] {
    const focused = followUpQuestions(answer, previousQuestions);
    const previous = new Set(previousQuestions.map((question) => question.trim().toLowerCase()));
    const contextIds = new Set(answer.sources.map(({ id }) => id));
    const focusedQuestions = new Set(focused.map(({ question }) => question.trim().toLowerCase()));
    const focusedLabels = new Set(focused.map(({ label }) => label.trim().toLowerCase()));
    const traversal = suggestedQuestions.filter(({ label, question, sourceIds }) => (
        sourceIds.length > 0
        && sourceIds.every((id) => !contextIds.has(id))
        && !previous.has(question.trim().toLowerCase())
        && !focusedQuestions.has(question.trim().toLowerCase())
        && !focusedLabels.has(label.trim().toLowerCase())
    ));

    return [...focused, ...traversal].slice(0, 5);
}
