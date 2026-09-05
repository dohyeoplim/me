import { auth } from "@/auth";

export default auth((req) => {
    const signInPage = ["/admin/signin", "/admin/signin/"].includes(req.nextUrl.pathname);
    if (req.auth?.user?.admin !== true && !signInPage) {
        const url = new URL("/admin/signin", req.nextUrl.origin);
        return Response.redirect(url);
    }
});

export const config = {
    matcher: ["/admin/:path*"],
};
