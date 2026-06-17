import { auth } from "@/auth";

export default auth((req) => {
    if (!req.auth && !req.nextUrl.pathname.startsWith("/admin/signin")) {
        const url = new URL("/admin/signin", req.nextUrl.origin);
        return Response.redirect(url);
    }
});

export const config = {
    matcher: ["/admin/:path*"],
};
