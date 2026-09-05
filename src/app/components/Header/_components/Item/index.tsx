type ItemProps = {
    label: string;
} & React.ComponentProps<"div">;

export default function Item({ label, className, ...props }: ItemProps) {
    return (
        <div
            className={`font-body02-light text-grey-800 hover:text-grey-900 py-2.5 ${className || ""}`}
            {...props}
        >
            {label}
        </div>
    );
}
