import Link from "next/link";
import { listEntries } from "@/app/lib/content/repository";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import SignOutButton from "./_components/SignOutButton";
import HomeLink from "./_components/HomeLink";
import { createEntry } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const entries = await listEntries("home_section");

    return (
        <div className="flex flex-col gap-8">
            <HeaderActions>
                <HomeLink />
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
                            <span className="font-body02-light text-grey-900">
                                {entry.title}
                            </span>
                            <span className="font-body05-light text-grey-400">
                                {entry.status}
                            </span>
                        </Link>
                    </li>
                ))}
                {entries.length === 0 && (
                    <li className="py-3 font-body04-light text-grey-400">
                        No entries yet. Create one below.
                    </li>
                )}
            </ul>

            <form
                action={createEntry}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
                <label className="flex flex-1 flex-col gap-1.5 font-caption01-light text-grey-400">
                    Title
                    <input
                        name="title"
                        placeholder="New section"
                        className="rounded-md border border-grey-200 bg-grey-50 px-3 py-2 font-body03-light text-grey-900 outline-none focus:border-grey-400"
                    />
                </label>
                <button
                    type="submit"
                    className="rounded-md bg-grey-900 px-4 py-2 font-body04-light text-grey-50"
                >
                    Create
                </button>
            </form>
        </div>
    );
}
