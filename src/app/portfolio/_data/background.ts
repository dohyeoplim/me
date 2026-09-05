export const experience = [
    {
        label: "Research & machine learning",
        items: "PyTorch, Transformers, OpenCV, LoRA, OCR, vision-language models, ASR, synthetic data, evaluation",
    },
    { label: "Languages", items: "Python, Swift, TypeScript" },
    { label: "Applications", items: "SwiftUI, Core ML, Next.js" },
    { label: "Tools", items: "Linux, Docker, Git, vLLM, LaTeX, Figma" },
];

export const beyondTheLab = {
    title: "Beyond the lab",
    infrastructure: {
        title: "Supporting shared research",
        description:
            "As a participating researcher in a national AI infrastructure R&D project, I support LLM " +
            "data processing and the GPU environments used across laboratories.",
        interest:
            "Working with researchers has drawn me toward distributed training, experiment monitoring, " +
            "and recovery during long training runs.",
        responsibilities: [
            { icon: "gpu", title: "GPU resources", detail: "NVIDIA MIG partitioning & allocation" },
            { icon: "container", title: "Research environments", detail: "Docker preparation & distribution" },
            { icon: "network", title: "Shared infrastructure", detail: "Bastion access, servers & InfiniBand" },
        ],
    },
    communities: [
        {
            name: "LIKELION University",
            period: "2025 to present",
            role: "SeoulTech, Vice President, 14th cohort",
            description:
                "Coordinating a 30-member chapter, technical sessions, invited talks, and hackathons. " +
                "Previously a member of the 13th cohort.",
        },
        {
            name: "GDG on Campus",
            period: "2025 to present",
            role: "SeoulTech, Core team, 5th & 6th cohorts",
            description:
                "Helping the campus developer community learn together. Organized 13 technical sessions " +
                "during the 5th cohort.",
        },
    ],
};

export const background = {
    achievement:
        "Ranked first in Applied Artificial Intelligence with a GPA of 4.34 / 4.5. " +
        "Awarded full tuition for five consecutive semesters.",
    title: "Background",
    metrics: [
        { value: "4.34 / 4.5", label: "GPA" },
        { value: "1st", label: "In the department" },
        { value: "5 semesters", label: "Full-tuition scholarship", detail: "Consecutive academic excellence awards" },
    ],
    education: [
        {
            school: "Seoul National University of Science and Technology",
            course: "B.Eng. in Applied Artificial Intelligence",
            period: "2024 to present",
        },
        {
            school: "Technische Hochschule Ulm, Germany",
            course: "Visiting student, Deep Learning for Industrial Data",
            period: "January to February 2026",
        },
    ],
    experienceTitle: "Technical experience",
    next: {
        label: "What I want to explore next",
        question: "How does the data we choose shape what a model can do?",
        description:
            "I want to study how data composition shapes domain-specific capabilities, how evaluation " +
            "reveals weaknesses, and how those findings can guide foundation model training.",
        action: "Back to the research",
    },
};
