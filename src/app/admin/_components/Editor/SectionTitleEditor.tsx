"use client";

type Props = {
    title: string;
    subtitle: string;
    onChange: (value: { title: string; subtitle: string }) => void;
};

export default function SectionTitleEditor({ title, subtitle, onChange }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-grey-500" />
                <input
                    value={subtitle}
                    placeholder="SUBTITLE"
                    onChange={(e) => onChange({ title, subtitle: e.target.value })}
                    className="w-full bg-transparent font-caption02-light uppercase text-grey-500 outline-none placeholder:text-grey-300"
                />
            </div>
            <input
                value={title}
                placeholder="Section title"
                onChange={(e) => onChange({ title: e.target.value, subtitle })}
                className="w-full bg-transparent font-title02-light text-grey-900 outline-none placeholder:text-grey-300"
            />
        </div>
    );
}
