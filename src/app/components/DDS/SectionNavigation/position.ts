type SectionBounds = { id: string; top: number; bottom: number };
type Viewport = { top: number; bottom: number };

export function sectionAtCenter(
    sections: SectionBounds[], viewport: Viewport, previous: string, atBottom = false,
) {
    if (!sections.length) return null;
    if (atBottom) return sections.at(-1)!.id;
    const center = (viewport.top + viewport.bottom) / 2;
    const distance = ({ top, bottom }: SectionBounds) => Math.max(top - center, center - bottom, 0);
    const nearest = sections.reduce((best, section) => distance(section) < distance(best) ? section : best);
    const current = sections.find(({ id }) => id === previous);
    const tolerance = Math.max(0, viewport.bottom - viewport.top) * 0.04;
    const currentVisible = current && current.bottom > viewport.top && current.top < viewport.bottom;
    return currentVisible && distance(current) <= distance(nearest) + tolerance ? current.id : nearest.id;
}

export function sectionScrollOffset(section: Omit<SectionBounds, "id">, headingTop: number, viewport: Viewport) {
    const center = (viewport.top + viewport.bottom) / 2;
    const headingOffset = headingTop - viewport.top;
    const bottomAfterScroll = section.bottom - headingOffset;
    return bottomAfterScroll <= center
        ? (section.top + section.bottom) / 2 - center
        : headingOffset;
}
