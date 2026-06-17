import Link from "next/link";
import { listEntries } from "@/app/lib/content/repository";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import SignOutButton from "./_components/SignOutButton";
import { createEntry } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const entries = await listEntries("home_section");

    return (
        <div className="flex flex-col gap-8">
            <HeaderActions>
                <SignOutButton />
            </HeaderActions>

            <h2 className="font-head01-medium text-grey-900">Home</h2>

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
                        No entries yet. Create one below.
                    </li>
                )}
            </ul>

            <form
                action={createEntry}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
                <label className="flex flex-1 flex-col gap-1 text-sm text-grey-500">
                    Slug
                    <input
                        name="slug"
                        required
                        placeholder="about"
                        className="rounded-md border border-grey-200 px-3 py-2 text-grey-900"
                    />
                </label>
                <label className="flex flex-1 flex-col gap-1 text-sm text-grey-500">
                    Title
                    <input
                        name="title"
                        placeholder="About"
                        className="rounded-md border border-grey-200 px-3 py-2 text-grey-900"
                    />
                </label>
                <button
                    type="submit"
                    className="rounded-md bg-grey-900 px-4 py-2 text-sm text-grey-50"
                >
                    Create
                </button>
            </form>
        </div>
    );
}
