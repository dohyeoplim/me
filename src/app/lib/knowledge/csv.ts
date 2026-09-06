import { KnowledgeEditSchema, type KnowledgeEdit, type KnowledgeSource } from "./schema";

const columns = ["id", "title", "text", "url", "keywords", "kind", "status"];

function cell(value: string) {
    const safe = /^[=+\-@\t\r']/.test(value) ? `'${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
}

export function exportKnowledgeCsv(sources: KnowledgeSource[]) {
    return "\uFEFF" + [columns.join(","), ...sources.map((source) => {
        return [source.id, source.title, source.text, source.url, JSON.stringify(source.keywords), source.kind,
            source.status]
            .map(cell).join(",");
    })].join("\r\n");
}

export function parseKnowledgeCsv(input: string): KnowledgeEdit[] {
    if (input.length > 4_000_000) throw new Error("CSV must be smaller than 4 MB of text.");
    const rows: string[][] = [];
    let row: string[] = [], value = "", quoted = false, endedQuote = false;
    const text = input.replace(/^\uFEFF/, "");
    for (let index = 0; index < text.length; index++) {
        const character = text[index]!;
        if (character === '"') {
            if (quoted && text[index + 1] === '"') { value += '"'; index++; }
            else if (quoted) { quoted = false; endedQuote = true; }
            else if (!value && !endedQuote) quoted = true;
            else throw new Error("Invalid CSV quote.");
        } else if (!quoted && (character === "," || character === "\n" || character === "\r")) {
            row.push(value); value = ""; endedQuote = false;
            if (character !== ",") {
                if (character === "\r" && text[index + 1] === "\n") index++;
                if (row.some(Boolean)) rows.push(row);
                row = [];
            }
        } else {
            if (endedQuote) throw new Error("Invalid text after CSV quote.");
            value += character;
        }
    }
    if (quoted) throw new Error("Unclosed CSV quote.");
    if (value || row.length) { row.push(value); rows.push(row); }
    const header = rows.shift();
    const legacyColumns = [...columns, "card_enabled", "card_title", "card_description", "card_body"];
    const legacy = header?.join(",") === legacyColumns.join(",");
    if (!header || (!legacy && header.join(",") !== columns.join(","))) {
        throw new Error("Use the exported CSV column order.");
    }
    if (!rows.length || rows.length > 500) throw new Error("Import between 1 and 500 sources at a time.");
    const ids = new Set<string>();
    return rows.map((cells, index) => {
        if (cells.length !== header.length) throw new Error(`Row ${index + 2} has missing or extra columns.`);
        if (legacy && cells.slice(columns.length).some(Boolean)) {
            throw new Error("Component settings are managed on the Reserved components page, not in source CSV.");
        }
        const values = cells.map((item) => /^'[=+\-@\t\r']/.test(item) ? item.slice(1) : item);
        const [id, title, text, url, keywords, kind, status] = values;
        if (id && ids.has(id)) throw new Error(`Duplicate source ID on row ${index + 2}.`);
        if (id) ids.add(id);
        const result = KnowledgeEditSchema.safeParse({
            id: id || `new-${index}`, title, text, url, keywords: JSON.parse(keywords || "[]"), kind, status,
        });
        if (!result.success) {
            throw new Error(`Row ${index + 2}. ${result.error.issues[0]?.message ?? "Invalid source."}`);
        }
        return result.data;
    });
}
