import { cn } from "@/app/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function Heading({ children, className }: Props) {
    return (
        <div className={cn("font-head01-medium text-grey-900", className)}>
            {children}
        </div>
    );
}
