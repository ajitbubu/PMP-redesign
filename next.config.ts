import type { NextConfig } from "next";

// Google Analytics (via @next/third-parties) needs these hosts; unsafe-inline
// is a pragmatic tradeoff here (no nonce plumbing) — tighten with a per-request
// nonce in middleware before this handles real user data.
//
// unsafe-eval is dev-only: next dev's webpack module system wraps modules in
// eval() for fast refresh/source maps, which CSP blocks without it — silently
// killing all client-side hydration in dev mode. Production builds don't use
// eval(), so prod CSP stays strict.
const isDev = process.env.NODE_ENV === "development";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.pravatar.cc https://images.unsplash.com https://www.google-analytics.com",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Demo avatars only. Replace with your own asset host in production.
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
