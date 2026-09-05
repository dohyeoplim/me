type Props = {
    number: string;
    title: string;
    description?: string;
};

export default function SectionHeading({ number, title, description }: Props) {
    return (
        <header className="mb-12 flex flex-col gap-4">
            <div className="flex items-baseline gap-4">
                <span className="ds-label tabular-nums">{number}</span>
                <h2 className="font-title02-light">{title}</h2>
            </div>
            {description && <p className="font-body02-light max-w-xl text-grey-500">{description}</p>}
        </header>
    );
}
