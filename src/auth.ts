import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [GitHub],
    callbacks: {
        signIn({ profile }) {
            return profile?.login === process.env.ADMIN_GITHUB_LOGIN;
        },
        authorized({ auth }) {
            return !!auth?.user;
        },
    },
    pages: {
        signIn: "/admin/signin",
    },
});
