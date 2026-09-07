export const research = {
    title: "Research",
    publicationsTitle: "Publications",
    programs: {
        title: "R&D participation",
        industrial: {
            title: "산업 AI용 데이터 전처리 자동화 기술개발",
            description: "Industrial OCR research with KETI & KOSPO.",
        },
        computing: {
            title: "컴퓨팅자원집중형 인공지능 응용 기술 개발",
            description: "Vision-language-action model research with IITP.",
            projectTitle: "분산 GPU 기반 비전-언어-행동 모델 확장 핵심 기술 개발",
            role: "Participating researcher",
            details: "Assist with requirements and technical development for an education-focused " +
                "vision-language-action (VLA) system.",
            infrastructure: "Support GPU resource allocation and shared research environments with Docker.",
        },
        culture: {
            title: "문화서비스확산형기술개발",
            description: "Multimodal AI for accessible content creation by seniors with ETRI.",
            projectTitle: "시니어의 콘텐츠 제작 접근성 향상을 위한 생성형 AI 기반 콘텐츠 창·저작 플랫폼 기술 개발",
            details: "Reviewed software, managed issues, and conducted QA in preparation for integration testing.",
        },
    },
    portfolioSummary:
        "I work on data generation, model development, and evaluation for computer vision and multimodal models.",
    affiliation: "Undergraduate researcher at the Visual Intelligence Lab, SeoulTech, since December 2025.",
    interests:
        "Current work examines how training data and evaluation affect models in unfamiliar domains. " +
        "Other interests include computer vision, speech recognition, and multimodal models.",
    additionalPublications: [
        {
            title:
                "Imagine the Structure Before You Speak: " +
                "Structural Imagination in Latent Space for Table Recognition",
            authors: "MinKi Jeong, Dohyeop Lim, Jongyoul Park",
            status: "Under review",
            role: "Co-author",
            url: "https://cv.dohyeoplim.me/Dohyeop_Lim.pdf",
        },
    ] as const,
    eact: {
        name: "E-ACT",
        role: "First author",
        result: "Improved exact-match accuracy by 12.3 to 31.2 percentage points across four benchmarks.",
        errorResult: "Prevented 89.5 to 93.6% of single-edit OCR errors from propagating to final predictions.",
        status: "Under review",
        description:
            "A factorized CTC decoder that enforces identifier length, allowed characters, and checksums. " +
            "Works with existing recognizers without retraining.",
        detailsLabel: "About the paper",
        contributions:
            "Defined the problem, implemented checksum tracking through the CTC trellis, " +
            "and evaluated recognition accuracy and error propagation.",
        paper: "E-ACT, Enforcing Arithmetic Constraints in CTC Trellises for Structured Identifier Recognition",
        authors: "Dohyeop Lim, MinKi Jeong, Jongyoul Park",
    },
    industrial: {
        name: "Industrial OCR data & evaluation",
        count: "~8,000",
        countLabel: "images annotated",
        description:
            "Developed OCR evaluation data with KETI. Built and deployed an annotation tool " +
            "and coordinated cross-checks.",
        insight: "More synthetic training images did not consistently improve recognition on real images.",
    },
    kraftbox: {
        name: "Kraftbox",
        description:
            "Built a document pipeline with dynamic tables, automatic annotations, and shared fields. " +
            "Added validation rules and controlled inconsistencies.",
        insight: "Applied Qwen vision-language models and revised schemas after finding field confusion across forms.",
    },
};

export const researchPublications = [
    { title: research.eact.paper, authors: research.eact.authors, role: research.eact.role, status: research.eact.status },
    ...research.additionalPublications,
];
