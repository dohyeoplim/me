export type Project = {
    name: string;
    period: string;
    title: string;
    contribution: string;
    outcome: string;
    recognition?: string;
    href: string;
    visual: "speech" | "calls" | "vision" | "graph" | "driving";
    image?: { src: string; alt: string };
    deck?: { prefix: string; count: number };
    placement?: "selected" | "additional";
};

export const projects: Project[] = [
    {
        name: "Collog",
        period: "July to August 2026",
        title: "Health records from family calls",
        contribution:
            "Built transcription, health extraction, and acoustic analysis to track changes " +
            "and suggest follow-up questions for older adults.",
        outcome: "",
        recognition: "14th LIKELION hackathon, Honorable Mention among 317 teams. AAC Track, 2nd of 128 teams.",
        href: "https://github.com/Collog-App",
        visual: "calls",
        deck: { prefix: "collog", count: 3 },
    },
    {
        name: "MochiCall",
        period: "July 2026",
        title: "Speech recognition for hospital transportation calls",
        contribution: "Fine-tuned Korean ASR with LoRA and combined specialized and multi-domain adapters.",
        outcome:
            "Specialized ASR led on full calls, multi-domain ASR on streaming. Combining predictions improved both.",
        recognition: "Grand Prize, AICOSS Summer AI SCI Bootcamp 2026",
        href: "https://github.com/Fresh-Mango-Mochi/welfare-call-asr",
        visual: "speech",
        deck: { prefix: "mochicall", count: 4 },
    },
    {
        name: "DocFusionX",
        placement: "additional",
        period: "January to February 2026, Ulm, Germany",
        title: "GraphRAG for long documents",
        contribution:
            "Used document relationships for retrieval and reasoning during a visiting student program " +
            "at Technische Hochschule Ulm.",
        outcome: "",
        href: "https://github.com/DocFusionX/server",
        visual: "graph",
        deck: { prefix: "docfusionx", count: 3 },
    },
    {
        name: "WONNIT",
        period: "July to September 2025",
        title: "On-device verification for shared spaces",
        contribution: "Developed scene classification, object detection, and before-and-after change detection.",
        outcome: "Deployed the models on iOS with Core ML.",
        href: "https://github.com/GGUNGSIL-WONNIT",
        visual: "vision",
        deck: { prefix: "wonnit", count: 4 },
    },
    {
        name: "DriverNet",
        period: "March to July 2025",
        title: "Detecting driver distraction from images",
        contribution:
            "Developed depth-map-based gated projection. Global image features control a gate over " +
            "depth-grouped features before projection and feature interaction.",
        outcome: "Implemented the EMA teacher training pipeline using moving averages of model parameters.",
        href: "https://github.com/DriverNet-Project/DriverNet",
        visual: "driving",
        deck: { prefix: "drivernet", count: 5 },
    },
];

export const projectSection = {
    detailsLabel: "Project details",
    title: "Selected projects",
    repositoryLabel: "GitHub",
};
