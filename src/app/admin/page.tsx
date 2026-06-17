import Link from "next/link";
import { listEntries } from "@/app/lib/content/repository";
import { seedFromFiles } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const entries = await listEntries("home_section");

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="font-head01-medium text-grey-900">Home</h2>
                <form action={seedFromFiles}>
                    <button
                        type="submit"
                        className="rounded border border-grey-200 px-3 py-1.5 text-sm text-grey-600"
                    >
                        Import current content
                    </button>
                </form>
            </div>
            <ul className="flex flex-col divide-y divide-grey-200">
                {entries.map((entry) => (
                    <li key={entry.id}>
                        <Link
                            href={`/admin/${entry.type}/${entry.slug}`}
                            className="flex items-center justify-between py-3"
                        >
                            <span className="text-grey-900">{entry.title}</span>
                            <span className="text-xs text-grey-400">
                                {entry.status}
                            </span>
                        </Link>
                    </li>
                ))}
                {entries.length === 0 && (
                    <li className="py-3 text-sm text-grey-400">
                        No entries yet. Import current content to start.
                    </li>
                )}
            </ul>
        </div>
    );
}
