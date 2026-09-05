type Props = {
    value: string;
    label: string;
    detail?: string;
};

export default function Metric({ value, label, detail }: Props) {
    return (
        <div className="flex flex-col items-start gap-dds-xs">
            <p className="font-metric-light">{value}</p>
            <p className="font-body03-regular">{label}</p>
            {detail && <p className="ds-label max-w-64">{detail}</p>}
        </div>
    );
}
