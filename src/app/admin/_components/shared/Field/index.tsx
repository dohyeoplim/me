"use client";

import { useEffect, useRef } from "react";

const labelClass = "flex flex-col gap-1.5 font-caption01-light text-grey-400";
const fieldClass =
    "w-full rounded-md border border-grey-200 bg-grey-50 px-3 py-2 font-body03-light text-grey-900 outline-none focus:border-grey-400";

type InputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

export function TextInput({ label, value, onChange }: InputProps) {
    return (
        <label className={labelClass}>
            {label}
            <input
                className={fieldClass}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

export function TextArea({ label, value, onChange }: InputProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return (
        <label className={labelClass}>
            {label}
            <textarea
                ref={ref}
                className={`${fieldClass} resize-none`}
                rows={2}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}
