import { createPortfolioSources } from "./sources";
import { KnowledgeSourceSchema, type KnowledgeSource } from "./schema";

export const portfolioRepositories = [
    {
        name: "dohyeoplim/E-ACT",
        description: "Code for E-ACT, arithmetic-constrained CTC decoding for structured identifier recognition.",
    },
    {
        name: "Fresh-Mango-Mochi/welfare-call-asr",
        description: "MochiCall voice agent for Korean transportation support calls. " +
            "Includes domain-adapted ASR, dispatch information extraction, and call handling.",
    },
    {
        name: "Collog-App/Collog-Server",
        description: "Collog server for family-call transcription, health information extraction, " +
            "acoustic analysis, and conversation records. Built with Python and FastAPI.",
    },
    {
        name: "Collog-App/Collog-iOS",
        description:
            "Swift iOS application for Collog, a family-call service that records health and lifestyle changes.",
    },
    {
        name: "GGUNGSIL-WONNIT/WONNIT-AI",
        description: "Vision models for WONNIT. Includes scene classification, indoor object detection, " +
            "and before-and-after change detection for shared spaces.",
    },
    {
        name: "GGUNGSIL-WONNIT/WONNIT-iOS",
        description: "WONNIT iOS application. Uses RoomPlan and ARKit for space scanning and Core ML " +
            "for visual verification, object recognition, and before-and-after comparison.",
    },
    {
        name: "DocFusionX/server",
        description: "Python server for DocFusionX, a structure-aware GraphRAG project for retrieval " +
            "and reasoning over long documents, developed during the Technische Hochschule Ulm visiting program.",
    },
    {
        name: "DriverNet-Project/DriverNet",
        description: "Distracted-driver detection pipeline. Includes depth-grouped features, gated projection, " +
            "parallel multi-aspect patching, data augmentation, and EMA teacher updates.",
    },
    {
        name: "dohyeoplim/me",
        description: "Source for this personal website, built with Next.js, React, and TypeScript. " +
            "Includes profile Q&A, a portfolio, research writing, and DDS reusable interface components.",
    },
];

export function curatePortfolioSources(existing: KnowledgeSource[], additional: KnowledgeSource[] = []) {
    const previous = new Map(existing.map((source) => [source.id, source]));
    const canonical = createPortfolioSources().map((source) => KnowledgeSourceSchema.parse({
        ...previous.get(source.id), ...source,
    }));
    const repositories = new Map([...existing, ...additional].flatMap((source) =>
        source.repository ? [[source.repository.fullName.toLowerCase(), source] as const] : [],
    ));
    const selected = portfolioRepositories.map(({ name, description }) => {
        const source = repositories.get(name.toLowerCase());
        if (!source) throw new Error(`Missing repository ${name}`);
        return KnowledgeSourceSchema.parse({
            ...source,
            text: `${description}\n\nRepository information describes the code. ` +
                "Use the separate profile and project notes to identify Dohyeop Lim's personal contributions.",
            status: "published",
        });
    });
    const website = KnowledgeSourceSchema.parse({
        ...previous.get("personal-website"), id: "personal-website", title: "Personal website and DDS",
        text: "Dohyeop Lim's personal website uses Next.js, React, and TypeScript. " +
            "It includes a profile Q&A interface grounded in curated public information, a portfolio, " +
            "research writing, and DDS (Dohyeop Lim Design System). " +
            "DDS provides shared typography, colors, spacing, interface components, and project graphics.",
        url: "https://github.com/dohyeoplim/me", keywords: ["website", "portfolio", "DDS", "Next.js", "홈페이지", "디자인"],
        kind: "project", status: "published", origin: "manual", cardId: null,
    });
    const published = [...canonical, ...selected, website];
    const keep = new Set(published.map(({ id }) => id));
    const excluded = existing.filter(({ id }) => !keep.has(id));
    return { published, excluded };
}
