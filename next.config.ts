import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.45.105"],
    reactCompiler: true,
    experimental: {
        viewTransition: true,
    },
    images: {
        unoptimized: process.env.NODE_ENV === "development",
        dangerouslyAllowLocalIP: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
            },
        ],
    },
};

export default nextConfig;
