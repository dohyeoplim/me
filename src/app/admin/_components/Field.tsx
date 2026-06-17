"use client";

const base =
    "w-full rounded border border-grey-200 bg-white px-2 py-1 text-sm text-grey-900";

type InputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

export function TextInput({ label, value, onChange }: InputProps) {
    return (
        <label className="flex flex-col gap-1 text-xs text-grey-500">
            {label}
            <input
                className={base}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

export function TextArea({ label, value, onChange }: InputProps) {
    return (
        <label className="flex flex-col gap-1 text-xs text-grey-500">
            {label}
            <textarea
                className={base}
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}
