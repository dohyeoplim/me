const imageBase = "https://ctylphpsl8g3drjb.public.blob.vercel-storage.com/portfolio";

export const industrialResearch = [
    {
        title: "OCR preprocessing",
        description: "Developed an integrated module for OCR-focused image preprocessing and compared " +
            "preprocessing performance across 3,194 industrial MPSC images.",
        images: [
            {
                src: `${imageBase}/keti_1.png`,
                alt: "OCR preprocessing performance comparison on industrial MPSC images",
                width: 2534,
                height: 1156,
            },
        ],
    },
    {
        title: "E-ACT",
        description: "Building on the OCR-focused preprocessing work from the first project year, developed " +
            "E-ACT, a general-purpose module that improves identifier OCR decoding without additional training.",
        images: [
            {
                src: `${imageBase}/keti_2.png`,
                alt: "E-ACT decoding architecture",
                width: 1980,
                height: 1185,
            },
            {
                src: `${imageBase}/keti_3.png`,
                alt: "Qualitative examples of identifier recognition with E-ACT",
                width: 1980,
                height: 894,
            },
        ],
    },
    {
        title: "Kraftbox",
        description: "Working with KOSPO (Korea Southern Power), identified the difficulty of quickly and " +
            "consistently checking handwritten safety work permits for missing required fields and entry errors. " +
            "Developed Kraftbox, a synthetic document generation pipeline, to support models and pipelines " +
            "for reviewing these permits.",
        images: [
            {
                src: `${imageBase}/keti_4.png`,
                alt: "Kraftbox synthetic document generation for safety work permits",
                width: 3500,
                height: 1618,
            },
        ],
    },
] as const;

export const industrialResearchPreview = [industrialResearch[0].images[0], industrialResearch[2].images[0]];
