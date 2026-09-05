export const profileCardRegistry = {
    profile: { type: "profile", id: "profile" },
    eact: { type: "research", id: "eact" },
    mochicall: { type: "project", id: "mochicall" },
    collog: { type: "project", id: "collog" },
    wonnit: { type: "project", id: "wonnit" },
    docfusionx: { type: "project", id: "docfusionx" },
} as const;

export type ProfileCardId = keyof typeof profileCardRegistry;
export type ProfileCard = (typeof profileCardRegistry)[ProfileCardId];

export type ProfileSource = {
    id: string;
    title: string;
    url: string;
};

export type ProfileAnswerBlock =
    | {
          type: "facts";
          title: string;
          items: { label: string; value: string }[];
          sourceIds: string[];
      }
    | {
          type: "steps";
          title: string;
          items: { title: string; description: string }[];
          sourceIds: string[];
      }
    | {
          type: "comparison";
          title: string;
          columns: string[];
          rows: { label: string; values: string[] }[];
          sourceIds: string[];
      }
    | {
          type: "timeline";
          title: string;
          items: { date: string; title: string; description: string }[];
          sourceIds: string[];
      };

export type ProfileFollowUp = {
    label: string;
    question: string;
    sourceIds: string[];
};

export type ProfileRepository = {
    sourceId: string;
    fullName: string;
    url: string;
    description: string;
    owner: string;
    ownerType: "User" | "Organization";
    language: string | null;
    reason: string;
};

export type ProfileChatAnswer = {
    answer: string;
    sources: ProfileSource[];
    cards: ProfileCard[];
    blocks: ProfileAnswerBlock[];
    followUps: ProfileFollowUp[];
    repositories: ProfileRepository[];
};
