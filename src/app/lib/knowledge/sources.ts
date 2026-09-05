import { profileDocuments } from "../profile-chat/documents";
import { profileCardRegistry, type ProfileCardId } from "../profile-chat/types";
import { KnowledgeSourceSchema, type KnowledgeSource } from "./schema";

export type PublishedKnowledgeSource = Omit<KnowledgeSource, "cardId"> & { cardId: ProfileCardId | null };

export function createPortfolioSources(): KnowledgeSource[] {
    return profileDocuments.map((document) => {
        const fallbackCardId = document.id in profileCardRegistry ? document.id as ProfileCardId : null;
        const cardId = document.cardId === undefined ? fallbackCardId : document.cardId;
        const kind = cardId ? profileCardRegistry[cardId].type : "experience";
        return KnowledgeSourceSchema.parse({
            ...document,
            kind: document.kind ?? kind,
            status: "published",
            cardId,
            origin: "portfolio",
        });
    });
}

export function effectivePublishedSource(source: KnowledgeSource): PublishedKnowledgeSource {
    const canonical = profileDocuments.find(({ id }) => id === source.id);
    const cardIsCurrent = source.origin !== "portfolio" || canonical?.text.trim() === source.text.trim();
    const cardId = cardIsCurrent && source.cardId && source.cardId in profileCardRegistry
        ? source.cardId as ProfileCardId
        : null;
    return { ...source, cardId };
}
