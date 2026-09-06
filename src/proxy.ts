import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { contentSecurityPolicy } from "@/app/lib/security/headers";

export default auth((req) => {
    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64");
    const policy = contentSecurityPolicy({ development: process.env.NODE_ENV === "development", nonce });
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", policy);
    const signInPage = ["/admin/signin", "/admin/signin/"].includes(req.nextUrl.pathname);
    const response = req.auth?.user?.admin !== true && !signInPage
        ? NextResponse.redirect(new URL("/admin/signin", req.nextUrl.origin))
        : NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", policy);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
});

export const config = {
    matcher: ["/admin/:path*"],
};
