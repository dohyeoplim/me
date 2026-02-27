import { cn } from "@/app/lib/utils";

type Props = {
    items: string[];
    className?: string;
};

export default function Enumerate({ items, className }: Props) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {items.map((item, i) => (
                <div key={i} className="font-body03-regular text-grey-800">
                    {item}
                </div>
            ))}
        </div>
    );
}
