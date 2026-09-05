import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full max-w-4xl mx-auto px-6 pb-30">
            <hr className="h-px text-grey-200 mb-6" />
            <div className="flex items-center justify-between gap-4">
                <small className="font-body04-light text-grey-500">&copy; 2026 Dohyeop Lim</small>
                <Link
                    href="/design-system"
                    className="text-sm text-grey-500 hover:text-grey-900"
                    aria-label="DDS, DohyeopLim Design System"
                >
                    DDS
                </Link>
            </div>
        </footer>
    );
}
