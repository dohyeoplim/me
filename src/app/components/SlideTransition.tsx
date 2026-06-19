import { ViewTransition } from "react";

export default function SlideTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ViewTransition
            enter={{
                "nav-forward": "slide-from-right",
                "nav-back": "slide-from-left",
                default: "none",
            }}
            exit={{
                "nav-forward": "slide-to-left",
                "nav-back": "slide-to-right",
                default: "none",
            }}
            default="none"
        >
            {children}
        </ViewTransition>
    );
}
