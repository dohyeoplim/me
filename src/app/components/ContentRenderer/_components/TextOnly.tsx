import { cn } from "@/app/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function TextOnly({ children, className }: Props) {
    return (
        <div className={cn("font-body02-regular text-grey-900", className)}>
            {children}
        </div>
    );
}
