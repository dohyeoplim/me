type ItemProps = {
    label: string;
} & React.ComponentProps<"div">;

export default function Item({ label, className, ...props }: ItemProps) {
    return (
        <div className={`font-body02-light text-ink hover:text-ink py-dds-sm ${className || ""}`} {...props}>
            {label}
        </div>
    );
}
