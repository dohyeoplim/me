import { cn } from "@/app/lib/utils";
import { textWithBreaks } from "../utils";
import KVRow from "./KVRow";
import TextOnly from "./TextOnly";

type Props = {
    name: string;
    year?: string;
    month?: string;
    tagline?: string;
    description?: string;
    meta?: string;
    className?: string;
};

export default function Project({
    name,
    year,
    month,
    tagline,
    description,
    meta,
    className,
}: Props) {
    return (
        <div className={cn("self-stretch flex flex-col gap-3", className)}>
            <div className="self-stretch flex flex-col gap-1">
                <KVRow
                    left={name}
                    right={
                        <>
                            {year ? (
                                <div className="font-body05-light text-grey-400 mt-px select-none">
                                    {year}
                                </div>
                            ) : null}
                            {month ? (
                                <div className="font-body01-regular text-grey-500 -mt-1 select-none">
                                    {month}
                                </div>
                            ) : null}
                        </>
                    }
                />
                {tagline ? (
                    <div className="font-body02-regular text-grey-800">
                        {tagline}
                    </div>
                ) : null}
            </div>

            {description ? (
                <div className="self-stretch font-body03-light text-grey-600">
                    {description}
                </div>
            ) : null}

            {meta ? (
                <TextOnly className="mt-1 font-body04-light text-grey-500!">
                    {textWithBreaks(meta)}
                </TextOnly>
            ) : null}
        </div>
    );
}
