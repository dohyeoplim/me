export type Project = {
    name: string;
    period: string;
    title: string;
    description: string;
    contribution: string;
    outcome: string;
    recognition?: string;
    href: string;
    visual: "speech" | "calls" | "vision" | "graph";
    tags: string[];
    image?: { src: string; alt: string };
};

export const projects: Project[] = [
    {
        name: "MochiCall",
        period: "July 2026",
        title: "From a phone call to a trip record.",
        description: "Korean speech recognition for hospital transportation support calls.",
        contribution:
            "Fine-tuned Korean ASR with LoRA and combined specialized and multi-domain adapters at inference.",
        outcome: "Different adapters led in full-call and streaming inputs. Combining predictions improved both.",
        recognition: "Grand Prize, AICOSS Summer AI SCI Bootcamp 2026",
        href: "https://github.com/Fresh-Mango-Mochi/welfare-call-asr",
        visual: "speech",
        tags: ["Speech recognition", "LoRA"],
    },
    {
        name: "Collog",
        period: "July to August 2026",
        title: "Everyday calls, a longer view of health.",
        description: "Health and lifestyle records for older adults, drawn from family conversations.",
        contribution: "Built transcription, health extraction, and acoustic analysis with tracking across calls.",
        outcome: "Previous conversations become context for noticing changes and preparing follow-up questions.",
        recognition: "LIKELION 2026, Honorable Mention of 317 teams, 2nd in AAC of 128 teams",
        href: "https://github.com/Collog-App",
        visual: "calls",
        tags: ["Audio analysis", "Longitudinal records"],
    },
    {
        name: "WONNIT",
        period: "July to September 2025",
        title: "A shared space, before and after.",
        description: "On-device visual verification for short-term rentals of idle spaces.",
        contribution: "Developed scene classification, object detection, and change detection models.",
        outcome: "Converted and deployed the vision models with Core ML for inference directly on iOS.",
        href: "https://github.com/GGUNGSIL-WONNIT",
        visual: "vision",
        tags: ["Computer vision", "Core ML"],
    },
    {
        name: "DocFusionX",
        period: "January to February 2026, Ulm, Germany",
        title: "Long documents, connected context.",
        description: "A structure-aware GraphRAG system for retrieval and reasoning over long documents.",
        contribution:
            "Explored document relationships as retrieval context during a visiting student program at TH Ulm.",
        outcome: "Connected document sections to support questions that need context from multiple passages.",
        href: "https://github.com/DocFusionX/server",
        visual: "graph",
        tags: ["GraphRAG", "Document understanding"],
    },
];

export const projectSection = {
    detailsLabel: "What I learned",
    title: "Selected projects",
    description: "Machine learning, carried through to the people who use it.",
    visualCaption: "Project process illustration",
    repositoryLabel: "GitHub",
};
