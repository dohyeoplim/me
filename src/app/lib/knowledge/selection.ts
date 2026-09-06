export function selectSourceRange(
    ordered: string[], selected: string[], anchor: string | null, target: string, checked: boolean,
) {
    const end = ordered.indexOf(target);
    if (end < 0) return selected;
    const start = anchor ? ordered.indexOf(anchor) : -1;
    const range = start < 0 ? [target] : ordered.slice(Math.min(start, end), Math.max(start, end) + 1);
    const next = new Set(selected);
    for (const id of range) {
        if (checked) next.add(id);
        else next.delete(id);
    }
    return [...next];
}
