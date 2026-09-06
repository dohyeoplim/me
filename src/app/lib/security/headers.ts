type PolicyOptions = { development: boolean; nonce?: string };

export function contentSecurityPolicy({ development, nonce }: PolicyOptions) {
    const scripts = nonce ? `'nonce-${nonce}' 'strict-dynamic'` : "'unsafe-inline'";
    return [
        "default-src 'self'",
        `script-src 'self' ${scripts}${development ? " 'unsafe-eval'" : ""}`,
        "script-src-attr 'none'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
        "font-src 'self'",
        [
            "connect-src 'self' https://*.vercel-insights.com https://*.blob.vercel-storage.com",
            "https://vercel.com/api/blob https://vercel.com/api/blob/",
            development ? "ws: wss:" : "",
        ].filter(Boolean).join(" "),
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'none'",
        "form-action 'self'",
        ...(!development ? ["upgrade-insecure-requests"] : []),
    ].join("; ");
}

export function securityHeaders(development: boolean) {
    return [
        { key: "Content-Security-Policy", value: contentSecurityPolicy({ development }) },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ...(!development ? [{
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
        }] : []),
    ];
}
