import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    allowedDevOrigins: ["192.168.0.46", "192.168.0.*", "*.local"],
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
