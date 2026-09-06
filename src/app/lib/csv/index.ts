export function csvCell(value: unknown) {
    const text = value == null ? "" : String(value);
    const safe = /^[\s\u0000-\u001f]*[=+@-]|^[\t\r\n]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
}
