export const research = {
    title: "Research",
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
            status: "WACV 2027, under review",
            role: "Co-author",
            url: "https://cv.dohyeoplim.me/Dohyeop_Lim.pdf",
        },
    ] as const,
    eact: {
        name: "E-ACT",
        role: "First author",
        result: "Improved exact-match accuracy by 12.3 to 31.2 percentage points across four benchmarks.",
        errorResult: "Prevented 89.5 to 93.6% of single-edit OCR errors from propagating to final predictions.",
        status: "WACV 2027, under review",
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
            "Lead SeoulTech's OCR research with KETI. Recruited annotators, deployed a labeling tool, " +
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
