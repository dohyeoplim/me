import Button, { type ButtonProps } from "../Button";
import { cn } from "@/app/lib/utils";

type Props = Omit<ButtonProps, "aria-label"> & {
    "aria-label": string;
};

export default function IconButton({ className, ...props }: Props) {
    return <Button className={cn("ds-icon-button", className)} {...props} />;
}
