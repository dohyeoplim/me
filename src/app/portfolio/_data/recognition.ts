export const recognitionExample = {
    title: "One trellis, two possible readings",
    rule: "(8 + 2) mod 10 = 0",
    caption: "Illustrative example. E-ACT selects a valid reading even when its posterior is lower.",
    candidates: [
        { code: "827", posterior: "0.42", label: "Invalid checksum", valid: false, path: [2, 1, 0, 1, 2] },
        { code: "820", posterior: "0.31", label: "Selected by E-ACT", valid: true, path: [2, 1, 0, 1, 1] },
    ],
};
