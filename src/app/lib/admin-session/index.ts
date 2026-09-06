import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const getAdminSession = cache(async () => {
    const session = await auth();
    return session?.user?.admin === true ? session : null;
});

export async function requireAdmin() {
    if (!await getAdminSession()) throw new Error("Unauthorized");
}

export async function requireAdminPage() {
    if (!await getAdminSession()) redirect("/admin/signin");
}
