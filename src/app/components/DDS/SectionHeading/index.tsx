type Props = {
    title: string;
    description?: string;
};

export default function SectionHeading({ title, description }: Props) {
    return (
        <header className="mb-dds-2xl flex flex-col gap-dds-md">
            <h2 className="font-title02-light">{title}</h2>
            {description && <p className="font-body02-light max-w-xl text-muted">{description}</p>}
        </header>
    );
}
