const ALIASES: Record<string, string> = {
    usa: "US",
    us: "US",
    "united states of america": "US",
    uk: "GB",
    england: "GB",
    scotland: "GB",
    korea: "KR",
    "republic of korea": "KR",
    "south korea": "KR",
    uae: "AE",
    turkey: "TR",
    "czech republic": "CZ",
    "hong kong": "HK",
    "hong kong sar": "HK",
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let countries: Map<string, string> | null = null;

function countryCodes() {
    if (countries) return countries;
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    countries = new Map(Object.entries(ALIASES));
    for (const first of LETTERS) {
        for (const second of LETTERS) {
            const code = `${first}${second}`;
            const name = names.of(code);
            const key = name?.toLowerCase();
            if (name && name !== code && key && !countries.has(key)) countries.set(key, code);
        }
    }
    return countries;
}

function flag(code: string) {
    return String.fromCodePoint(...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
}

export function locationFlags(location: string) {
    const codes = location.split(";").flatMap((place) => {
        const country = place.replace(/\([^)]*\)/g, "").split(",").at(-1)?.trim().toLowerCase();
        const code = country ? countryCodes().get(country) : undefined;
        return code ? [code] : [];
    });
    return [...new Set(codes)].map(flag).join(" ");
}
