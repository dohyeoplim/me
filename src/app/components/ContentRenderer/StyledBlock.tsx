import { styleClasses } from "@/app/lib/content/style";
import type { BlockStyle } from "./types";

type Props = {
    style?: BlockStyle;
    children: React.ReactNode;
};

export default function StyledBlock({ style, children }: Props) {
    const className = styleClasses(style);
    if (!className) return <>{children}</>;
    return <div className={className}>{children}</div>;
}
