import Link from "next/link";

export default function Footer() {
    return (
        <footer className="dds-container pb-dds-3xl">
            <hr className="h-px text-line mb-dds-lg" />
            <div className="flex items-center justify-between gap-dds-md">
                <small className="font-body04-light text-muted">&copy; 2026 Dohyeop Lim</small>
                <Link
                    href="/design-system"
                    className="font-body03-regular text-muted hover:text-ink"
                    aria-label="DDS, DohyeopLim Design System"
                >
                    DDS
                </Link>
            </div>
        </footer>
    );
}
