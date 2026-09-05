export const research = {
    title: "Research",
    description: "From collecting the data to understanding the errors. My work spans the full research process.",
    eact: {
        name: "E-ACT",
        role: "First author",
        status: "WACV 2027 · Under review",
        headline: "One wrong character can make an entire identifier unusable.",
        description:
            "I developed a factorized CTC decoder that brings length, allowed characters, and checksum " +
            "rules into recognition. It works with existing recognizers without retraining.",
        metrics: [
            {
                value: "+12.3 to 31.2",
                label: "Percentage points in exact-match accuracy",
                detail: "Improvement across four structured identifier benchmarks.",
            },
            {
                value: "89.5 to 93.6%",
                label: "Single-edit errors prevented",
                detail: "Unconstrained OCR errors stopped from propagating to final predictions.",
            },
        ],
        detailsLabel: "Method, contributions & paper",
        contributions:
            "I defined the problem, designed the arithmetic constraints, and implemented a factorized " +
            "decoder carrying checksum information through the CTC trellis. I evaluated four benchmarks " +
            "and analyzed error propagation.",
        paper: "E-ACT, Enforcing Arithmetic Constraints in CTC Trellises for Structured Identifier Recognition",
        authors: "Dohyeop Lim, MinKi Jeong, Jongyoul Park",
        submission: "Submitted to WACV 2027, under review.",
    },
    industrial: {
        name: "Industrial OCR data & evaluation",
        context: "SeoulTech × KETI · National R&D",
        count: "~8,000",
        countLabel: "images annotated",
        steps: ["Collection", "Annotation", "Cross-check"],
        description:
            "Leading the SeoulTech OCR work, from recruiting annotators and deploying a labeling tool " +
            "to synthetic training data, evaluation, and technical discussions with partners.",
        insight:
            "More synthetic data did not consistently help on real images. Data composition and evaluation " +
            "distributions became the next questions.",
    },
    kraftbox: {
        name: "Kraftbox",
        context: "Synthetic documents · Vision-language models",
        description:
            "Built a generation pipeline with dynamic tables, automatic annotations, and shared fields " +
            "across forms. Added validation rules and controlled inconsistencies for extraction and verification " +
            "with Qwen-family models.",
        insight:
            "Layout and meaning both shape learning. I revised target schemas after investigating field " +
            "confusion across document types.",
        diagram: {
            label: "Shared information",
            identifier: "ID 024",
            forms: ["Order", "Invoice", "Delivery"],
            caption: "Illustrative forms linked by a common field.",
        },
    },
};
