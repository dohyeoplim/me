export const research = {
    title: "Research",
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
