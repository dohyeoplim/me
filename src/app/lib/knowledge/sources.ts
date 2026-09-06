import { profileDocuments } from "../profile-chat/documents";
import { profileCardRegistry, type ProfileCardId } from "../profile-chat/types";
import { KnowledgeSourceSchema, type KnowledgeSource } from "./schema";
import { defaultReservedComponents, type ReservedComponent } from "../reserved-components/schema";
import type { CardPresentation } from "../reserved-components/presentation";

export type PublishedKnowledgeSource = KnowledgeSource & {
    cardId: ProfileCardId | null; cardPresentation?: CardPresentation;
};

export function createPortfolioSources(): KnowledgeSource[] {
    return profileDocuments.map((document) => {
        const fallbackCardId = Object.hasOwn(profileCardRegistry, document.id)
            ? document.id as ProfileCardId
            : null;
        const cardId = document.cardId === undefined ? fallbackCardId : document.cardId;
        const kind = cardId ? profileCardRegistry[cardId].type : "experience";
        return KnowledgeSourceSchema.parse({
            ...document,
            kind: document.kind ?? kind,
            status: "published",
            origin: "portfolio",
        });
    });
}

export function effectivePublishedSource(
    source: KnowledgeSource, components: ReservedComponent[] = defaultReservedComponents,
): PublishedKnowledgeSource {
    const canonical = profileDocuments.find(({ id }) => id === source.id);
    const component = components.find((item) => item.enabled && item.sourceIds.includes(source.id));
    const cardIsCurrent = Boolean(component?.presentation) || source.origin !== "portfolio" ||
        canonical?.text.trim() === source.text.trim();
    const cardId = cardIsCurrent ? component?.id ?? null : null;
    const presentation = component?.presentation ?? null;
    const text = presentation
        ? `${source.text}\n\n${presentation.title}\n${presentation.description}\n${presentation.body}`
        : source.text;
    return { ...source, text, cardId, ...(presentation ? { cardPresentation: presentation } : {}) };
}
