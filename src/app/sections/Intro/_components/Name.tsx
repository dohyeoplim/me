type Props = {
    name: string;
    tagline: string;
};

export default function Name({ name, tagline }: Props) {
    return (
        <div className="flex flex-col gap-2 text-grey-900 select-none">
            <h1 className="font-title01-light">{name}</h1>
            <h2 className="font-body01-light">{tagline}</h2>
        </div>
    );
}
