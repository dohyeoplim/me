import { z } from "../schema";

export const CONFERENCE_AREAS = {
    ml: "Machine learning",
    theory: "Learning theory",
    cv: "Computer vision",
    nlp: "Language",
    ai: "Artificial intelligence",
    dm: "Data mining",
    docai: "Document AI",
} as const;

export type ConferenceArea = keyof typeof CONFERENCE_AREAS;

function isPublicHttpsUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" && !url.username && !url.password;
    } catch {
        return false;
    }
}

export const DeadlineSchema = z.object({
    label: z.string().trim().min(1).max(40),
    at: z.iso.datetime({ offset: true }),
});
export type Deadline = z.infer<typeof DeadlineSchema>;

export const ConferenceSchema = z.object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/),
    name: z.string().trim().min(1).max(80),
    year: z.number().int().min(2000).max(2100),
    area: z.enum(Object.keys(CONFERENCE_AREAS) as [ConferenceArea, ...ConferenceArea[]]),
    url: z.string().trim().max(2_000).refine(isPublicHttpsUrl, "Use a public https URL."),
    location: z.string().trim().max(120),
    startsOn: z.iso.date().nullable(),
    endsOn: z.iso.date().nullable(),
    deadlines: z.array(DeadlineSchema).max(8),
    status: z.enum(["draft", "published"]),
}).refine(({ startsOn, endsOn }) => !startsOn || !endsOn || startsOn <= endsOn, "End date is before start date.");
export type Conference = z.infer<typeof ConferenceSchema>;

export function conferenceId(name: string, year: number) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return `${slug || "conference"}-${year}`;
}
