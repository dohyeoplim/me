"use client";

import { signOutAction } from "@/app/admin/actions";

export default function SignOutButton() {
    return (
        <form action={signOutAction}>
            <button type="submit" className="text-sm text-grey-500">
                Sign out
            </button>
        </form>
    );
}
