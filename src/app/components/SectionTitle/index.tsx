import { SectionTitleProps } from "./types";

export default function SectionTitle({
    title,
    subtitle,
    includeStroke = true,
}: SectionTitleProps) {
    return (
        <div className="flex flex-col gap-4 select-none">
            {subtitle && (
                <div className="flex items-center gap-3">
                    {includeStroke && (
                        <div className="w-8 h-[0.5px] bg-grey-500" />
                    )}
                    <h3 className="font-caption02-light text-grey-500 uppercase">
                        {subtitle}
                    </h3>
                </div>
            )}

            {title && (
                <h2 className="font-title02-light text-grey-900">{title}</h2>
            )}
        </div>
    );
}
