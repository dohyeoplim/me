import { parse } from "yaml";
import { z } from "../schema";
import { ConferenceSchema, type Conference, type Deadline } from "./schema";
import type { TrackedConference } from "./sources";

const EditionSchema = z.object({
    year: z.number().int(),
    link: z.string(),
    timeline: z.array(z.record(z.string(), z.unknown())).max(20),
    timezone: z.string().max(20),
    date: z.string().max(200).optional(),
    place: z.string().max(200).optional(),
});
type Edition = z.infer<typeof EditionSchema>;

const EntrySchema = z.object({
    title: z.string().max(80),
    conference_key: z.string().max(80),
    confs: z.array(z.unknown()).max(100),
});

const LABELS = [
    ["abstract_deadline", "Abstract", "submission"],
    ["deadline", "Paper", "submission"],
    ["rebuttal_deadline", "Rebuttal", "review"],
    ["decision_deadline", "Notification", "review"],
] as const;

function pacificOffset(local: string) {
    const instant = Date.parse(`${local}-08:00`);
    const name = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", timeZoneName: "shortOffset" })
        .formatToParts(instant).find(({ type }) => type === "timeZoneName")?.value;
    return name === "GMT-7" ? "-07:00" : "-08:00";
}

export function zoneOffset(zone: string, local: string) {
    const value = zone.trim().toUpperCase();
    if (value === "AOE") return "-12:00";
    if (value === "UTC" || value === "GMT") return "+00:00";
    if (["PT", "PST", "PDT"].includes(value)) return pacificOffset(local);
    const match = /^UTC([+-])(\d{1,2})(?::?(\d{2}))?$/.exec(value);
    if (!match?.[1] || !match[2] || Number(match[2]) > 14) return null;
    return `${match[1]}${match[2].padStart(2, "0")}:${match[3] ?? "00"}`;
}

export function toDeadlineTime(value: unknown, zone: string) {
    if (typeof value !== "string") return null;
    const match = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/.exec(value.trim());
    if (!match) return null;
    const local = `${match[1]}T${match[2]}`;
    const offset = zoneOffset(zone, local);
    const at = offset && `${local}${offset}`;
    return at && !Number.isNaN(Date.parse(at)) ? at : null;
}

function editionDeadlines(edition: Edition): Deadline[] {
    const rounds = edition.timeline.length;
    return edition.timeline.flatMap((row, index) => {
        const round = rounds > 1 ? `, round ${index + 1}` : "";
        return LABELS.flatMap(([key, label, kind]) => {
            const at = toDeadlineTime(row[key], edition.timezone);
            return at ? [{ label: `${label}${round}`, kind, at }] : [];
        });
    }).sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

// Prefer the edition whose next deadline is closest, so a future edition still marked TBD does not hide open calls.
function pickEdition(editions: { edition: Edition; deadlines: Deadline[] }[], now: number) {
    const upcoming = editions.map((item) => ({
        item, next: Math.min(...item.deadlines.map(({ at }) => Date.parse(at)).filter((time) => time > now)),
    })).filter(({ next }) => Number.isFinite(next)).sort((a, b) => a.next - b.next)[0];
    return upcoming?.item ?? editions.toSorted((a, b) => b.edition.year - a.edition.year)[0];
}

export function parseCcfddlFeed(text: string, tracked: readonly TrackedConference[], now: number): Conference[] {
    const feed: unknown = parse(text, { maxAliasCount: 50 });
    if (!Array.isArray(feed)) throw new Error("Unexpected feed shape.");
    const entries = new Map(feed.flatMap((value) => {
        const entry = EntrySchema.safeParse(value);
        return entry.success ? [[entry.data.conference_key, entry.data] as const] : [];
    }));
    return tracked.flatMap((source) => {
        const entry = entries.get(source.key);
        if (!entry) return [];
        const editions = entry.confs.flatMap((value) => {
            const edition = EditionSchema.safeParse(value);
            return edition.success ? [{ edition: edition.data, deadlines: editionDeadlines(edition.data) }] : [];
        });
        const picked = pickEdition(editions, now);
        if (!picked) return [];
        const conference = ConferenceSchema.safeParse({
            id: source.id,
            name: source.name ?? entry.title,
            year: picked.edition.year,
            area: source.area,
            url: picked.edition.link,
            location: picked.edition.place ?? "",
            dates: picked.edition.date ?? "",
            deadlines: picked.deadlines.slice(0, 16),
            status: "published",
        });
        return conference.success ? [conference.data] : [];
    });
}
