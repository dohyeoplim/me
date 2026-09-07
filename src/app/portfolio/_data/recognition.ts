export const recognitionExample = {
    description: "Standard OCR and E-ACT use the same recognizer predictions. " +
        "E-ACT changes a choice to satisfy identifier rules.",
    paths: [
        {
            name: "Standard OCR", constrained: false, rows: [0, 1, 0, 1, 0, 1],
            legend: "Greedy",
            action: "Read text, then check the rules.",
            detail: "Validation can reject the reading, but cannot revise it.",
        },
        {
            name: "E-ACT", constrained: true, rows: [0, 1, 0, 2, 0, 1],
            legend: "E-ACT admissible path",
            action: "Apply the rules during decoding.",
            detail: "Select a reading that satisfies the identifier rules.",
        },
    ],
};
