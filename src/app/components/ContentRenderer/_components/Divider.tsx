import { cn } from "@/app/lib/utils";

type Props = {
    className?: string;
};

export default function Divider({ className }: Props) {
    return (
        <hr
            className={cn(
                "w-full border-none h-[0.5px] bg-grey-200",
                className,
            )}
        />
    );
}
