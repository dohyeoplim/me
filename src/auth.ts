import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyAdminCredential } from "@/app/lib/admin-auth";

const adminSessionLifetime = 8 * 60 * 60 * 1000;

class RateLimitedSignin extends CredentialsSignin {
    code = "rate-limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            id: "totp",
            name: "One-time code",
            credentials: {
                password: { label: "Password", type: "password" },
                code: { label: "One-time code", type: "text" },
            },
            async authorize(credentials, request) {
                const result = await verifyAdminCredential(credentials.password, credentials.code, request);
                if (result === "rate-limited") throw new RateLimitedSignin();
                return result === "valid" ? { id: "admin", name: "Dohyeop Lim", admin: true } : null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60,
    },
    logger: {
        error(error) {
            if (error instanceof CredentialsSignin) {
                console.warn("[auth] Admin sign-in rejected.");
                return;
            }
            console.error(error);
        },
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.admin = user.id === "admin" && user.admin === true;
                token.adminExpiresAt = Date.now() + adminSessionLifetime;
            }
            if (typeof token.adminExpiresAt !== "number" || token.adminExpiresAt <= Date.now()) return null;
            return token;
        },
        session({ session, token }) {
            session.user.admin = token.admin === true
                && typeof token.adminExpiresAt === "number"
                && token.adminExpiresAt > Date.now();
            return session;
        },
        authorized({ auth }) {
            return auth?.user?.admin === true;
        },
    },
    pages: {
        signIn: "/admin/signin",
    },
});
