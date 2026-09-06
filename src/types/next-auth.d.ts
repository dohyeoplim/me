import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & { admin: boolean };
    }

    interface User {
        admin?: boolean;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        admin?: boolean;
        adminExpiresAt?: number;
    }
}
