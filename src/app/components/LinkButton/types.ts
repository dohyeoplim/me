type LinkButtonIcon = "arrow" | "external";

export type LinkButtonProps = {
    label: string;
    icon?: LinkButtonIcon;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;
