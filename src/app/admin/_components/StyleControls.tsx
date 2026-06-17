"use client";

import {
    SIZE_TOKENS,
    COLOR_TOKENS,
    ALIGN_TOKENS,
    WEIGHT_TOKENS,
} from "@/app/lib/content/schema";
import type { BlockStyle } from "@/app/lib/content/schema";

const selectClass =
    "rounded border border-grey-200 bg-white px-2 py-1 text-sm text-grey-700";

type Props = {
    style?: BlockStyle;
    onChange: (style: BlockStyle) => void;
};

function set(style: BlockStyle, key: keyof NonNullable<BlockStyle>, value: string) {
    const next = { ...style };
    if (value) next[key] = value as never;
    else delete next[key];
    return next;
}

export default function StyleControls({ style, onChange }: Props) {
    const s = style ?? {};
    return (
        <div className="flex flex-wrap gap-2">
            <select
                className={selectClass}
                value={s.size ?? ""}
                onChange={(e) => onChange(set(s, "size", e.target.value))}
            >
                <option value="">size</option>
                {SIZE_TOKENS.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
            <select
                className={selectClass}
                value={s.color ?? ""}
                onChange={(e) => onChange(set(s, "color", e.target.value))}
            >
                <option value="">color</option>
                {COLOR_TOKENS.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
            <select
                className={selectClass}
                value={s.align ?? ""}
                onChange={(e) => onChange(set(s, "align", e.target.value))}
            >
                <option value="">align</option>
                {ALIGN_TOKENS.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
            <select
                className={selectClass}
                value={s.weight ?? ""}
                onChange={(e) => onChange(set(s, "weight", e.target.value))}
            >
                <option value="">weight</option>
                {WEIGHT_TOKENS.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
        </div>
    );
}
