export const DEADLINE_OFFSETS = [
    { value: "-12:00", label: "AoE (UTC-12)" },
    { value: "-08:00", label: "UTC-8" },
    { value: "-07:00", label: "UTC-7" },
    { value: "-05:00", label: "UTC-5" },
    { value: "-04:00", label: "UTC-4" },
    { value: "+00:00", label: "UTC" },
    { value: "+01:00", label: "UTC+1" },
    { value: "+02:00", label: "UTC+2" },
    { value: "+08:00", label: "UTC+8" },
    { value: "+09:00", label: "UTC+9" },
] as const;

export type DeadlineInput = { label: string; local: string; offset: string };

export function splitDeadlineTime(at: string): Omit<DeadlineInput, "label"> {
    const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.exec(at);
    if (!match?.[1] || !match[2]) return { local: "", offset: "-12:00" };
    return { local: match[1], offset: match[2] === "Z" ? "+00:00" : match[2] };
}

export function joinDeadlineTime(local: string, offset: string) {
    return `${local.slice(0, 16)}:00${offset}`;
}
