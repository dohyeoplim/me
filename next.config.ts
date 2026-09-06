import type { NextConfig } from "next";
import { securityHeaders } from "./src/app/lib/security/headers";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.45.105"],
    reactCompiler: true,
    agentRules: false,
    poweredByHeader: false,
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders(process.env.NODE_ENV === "development") }];
    },
    images: {
        unoptimized: process.env.NODE_ENV === "development",
        dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
            },
        ],
    },
};

export default nextConfig;
