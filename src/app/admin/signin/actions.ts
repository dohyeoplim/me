"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { isAdminAuthConfigured } from "@/app/lib/admin-auth";

export async function signInWithTotp(formData: FormData) {
    if (!isAdminAuthConfigured()) redirect("/admin/signin?error=unavailable");
    try {
        await signIn("totp", {
            accessKey: formData.get("accessKey"),
            code: formData.get("code"),
            redirectTo: "/admin",
        });
    } catch (error) {
        if (!(error instanceof AuthError)) throw error;
        const code = error instanceof CredentialsSignin
            ? error.code === "rate-limited" ? "rate-limited" : "invalid"
            : "unavailable";
        redirect(`/admin/signin?error=${code}`);
    }
}
