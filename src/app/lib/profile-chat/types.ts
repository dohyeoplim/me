export const profileCardRegistry = {
    profile: { type: "profile", id: "profile" },
    eact: { type: "research", id: "eact" },
    "industrial-ocr": { type: "research", id: "industrial-ocr" },
    kraftbox: { type: "research", id: "kraftbox" },
    mochicall: { type: "project", id: "mochicall" },
    collog: { type: "project", id: "collog" },
    wonnit: { type: "project", id: "wonnit" },
    docfusionx: { type: "project", id: "docfusionx" },
    education: { type: "education", id: "education" },
    infrastructure: { type: "experience", id: "infrastructure" },
    community: { type: "experience", id: "community" },
    skills: { type: "experience", id: "skills" },
} as const;

export type ProfileCardId = keyof typeof profileCardRegistry;
export type ProfileCard = (typeof profileCardRegistry)[ProfileCardId];

export type ProfileSource = {
    id: string;
    title: string;
    url: string;
};

export type ProfileChatAnswer = {
    answer: string;
    sources: ProfileSource[];
    cards: ProfileCard[];
};
