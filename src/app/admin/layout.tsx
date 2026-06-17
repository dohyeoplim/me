import Link from "next/link";
import { signOut } from "@/auth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto max-w-5xl px-6 py-10">
            <header className="mb-8 flex items-center justify-between">
                <Link href="/admin" className="font-head01-medium text-grey-900">
                    CMS
                </Link>
                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/admin/signin" });
                    }}
                >
                    <button type="submit" className="text-sm text-grey-500">
                        Sign out
                    </button>
                </form>
            </header>
            {children}
        </div>
    );
}
