import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
