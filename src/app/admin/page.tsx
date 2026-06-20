import Link from "next/link";
import { listEntries, listPosts } from "@/app/lib/content/repository";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import SignOutButton from "./_components/shared/SignOutButton";
import ExitLink from "./_components/shared/ExitLink";
import EntryList from "./_components/shared/EntryList";
import { createEntry, createPost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const entries = await listEntries("home_section");
    const posts = await listPosts();

    return (
        <div className="flex flex-col gap-8">
            <HeaderActions>
                <ExitLink />
                <SignOutButton />
            </HeaderActions>

            <Link
                href="/admin/intro"
                className="flex items-center justify-between border-b border-grey-200 pb-3 font-body02-light text-grey-900"
            >
                Intro
                <span className="font-body05-light text-grey-400">edit</span>
            </Link>

            <h2 className="font-head01-medium text-grey-900">Home</h2>

            <EntryList entries={entries} type="home_section" />

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

            <h2 className="mt-4 font-head01-medium text-grey-900">Writing</h2>

            {posts.length === 0 ? (
                <p className="font-body04-light text-grey-400">
                    No posts yet. Create one below.
                </p>
            ) : (
                <ul className="flex flex-col divide-y divide-grey-200">
                    {posts.map((post) => (
                        <li
                            key={post.id}
                            className="flex items-center justify-between py-3"
                        >
                            <Link
                                href={`/admin/post/${post.slug}`}
                                className="font-body02-light text-grey-900"
                            >
                                {post.title}
                            </Link>
                            <span className="font-body05-light text-grey-400">
                                {post.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <form
                action={createPost}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
                <label className="flex flex-1 flex-col gap-1.5 font-caption01-light text-grey-400">
                    Title
                    <input
                        name="title"
                        placeholder="New post"
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
