import type { Conference, Deadline } from "./schema";

const DAY = 86_400_000;

export type UpcomingConference = { conference: Conference; next: Deadline };

export type DeadlineBoard = {
    upcoming: UpcomingConference[];
    unannounced: Conference[];
    past: Conference[];
};

const time = (deadline: Deadline) => Date.parse(deadline.at);

export function nextSubmission(conference: Conference, now: number) {
    return conference.deadlines.filter((deadline) => deadline.kind === "submission" && time(deadline) > now)
        .sort((a, b) => time(a) - time(b))[0] ?? null;
}

function lastDeadline(conference: Conference) {
    return Math.max(...conference.deadlines.map(time));
}

export function buildDeadlineBoard(conferences: Conference[], now: number): DeadlineBoard {
    const upcoming: UpcomingConference[] = [];
    const unannounced: Conference[] = [];
    const past: Conference[] = [];
    for (const conference of conferences) {
        const next = nextSubmission(conference, now);
        if (next) upcoming.push({ conference, next });
        else if (conference.deadlines.length === 0) unannounced.push(conference);
        else past.push(conference);
    }
    return {
        upcoming: upcoming.sort((a, b) => time(a.next) - time(b.next)),
        unannounced: unannounced.sort((a, b) => a.year - b.year || a.name.localeCompare(b.name)),
        past: past.sort((a, b) => lastDeadline(b) - lastDeadline(a)),
    };
}

export function remainingLabel(at: string, now: number) {
    const days = Math.floor((Date.parse(at) - now) / DAY);
    if (days < 1) return "Today";
    return days === 1 ? "1 day" : `${days} days`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function zoneLabel(offset: string) {
    if (offset === "Z" || offset === "+00:00") return "UTC";
    if (offset === "-12:00") return "AoE";
    return `UTC${offset}`;
}

// Deadlines are announced in a local zone such as AoE, so the stored wall time is shown as written.
export function formatDeadline(at: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.exec(at);
    if (!match) return at;
    const [, year, month, day, clock, offset = "Z"] = match;
    return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}, ${clock} ${zoneLabel(offset)}`;
}

export function formatSeoulTime(at: string) {
    return new Date(at).toLocaleString("en-US", {
        timeZone: "Asia/Seoul", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }) + " KST";
}
