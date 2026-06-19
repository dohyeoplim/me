"use client";

import { signOutAction } from "@/app/admin/actions";

export default function SignOutButton() {
    return (
        <form action={signOutAction}>
            <button type="submit" className="font-body04-light text-grey-500">
                Sign out
            </button>
        </form>
    );
}
