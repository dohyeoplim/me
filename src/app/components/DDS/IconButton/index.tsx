import Button, { type ButtonProps } from "../Button";
import { cn } from "@/app/lib/utils";

export type IconButtonProps = Omit<ButtonProps, "aria-label"> & {
    "aria-label": string;
};

export default function IconButton({ className, ...props }: IconButtonProps) {
    return <Button className={cn("ds-icon-button", className)} {...props} />;
}
