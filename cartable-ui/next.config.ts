import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

/* =========================
   PWA – Install Only
========================= */

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",

  // ❌ هیچ caching برای navigation
  cacheOnFrontEndNav: false,

  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

    // ✅ فقط asset cache (SAFE)
    runtimeCaching: [
      // Next.js static assets (hashed & immutable)
      {
        urlPattern: ({ url }) =>
          url.origin === self.location.origin &&
          url.pathname.startsWith("/_next/static/"),
        handler: "CacheFirst",
      },

      // Images
      {
        urlPattern: ({ url }) =>
          url.origin === self.location.origin &&
          /\.(png|jpg|jpeg|svg|gif|webp|ico|avif)$/i.test(url.pathname),
        handler: "CacheFirst",
      },

      // Fonts
      {
        urlPattern: ({ url }) =>
          url.origin === self.location.origin &&
          /\.(woff|woff2|ttf|eot)$/i.test(url.pathname),
        handler: "CacheFirst",
      },
    ],

    // ❌ هیچ fallback یا offline page
    navigateFallback: undefined,
    navigateFallbackDenylist: [/^\/api\//],
  },
});

/* =========================
   Next.js Config
========================= */

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  poweredByHeader: false,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    optimizePackageImports: ["@/components", "@/lib", "@/utils"],
    scrollRestoration: true,
  },

  /* =========================
     Security & Cache Headers
  ========================= */

  async headers() {
    const allowedOrigins = ["'self'"];

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BFF_URL;

    if (apiBaseUrl) {
      try {
        allowedOrigins.push(new URL(apiBaseUrl).origin);
      } catch {}
    }

    const authIssuer =
      process.env.AUTH_ISSUER || process.env.NEXT_PUBLIC_AUTH_ISSUER;

    if (authIssuer) {
      try {
        const origin = new URL(authIssuer).origin;
        if (!allowedOrigins.includes(origin)) {
          allowedOrigins.push(origin);
        }
      } catch {}
    }

    if (process.env.NODE_ENV === "development") {
      allowedOrigins.push("http://localhost:*", "https://localhost:*");
    }
    const isDev = process.env.NODE_ENV === "development";
    return [
      /* ---------- Global Security ---------- */
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' ${
                isDev ? "'unsafe-eval' 'unsafe-inline'" : "'unsafe-inline'"
              }`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              `connect-src ${allowedOrigins.join(" ")}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },

      /* ---------- Static Assets ---------- */
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/:path*.{jpg,jpeg,png,gif,webp,svg,ico,avif}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },

      /* ---------- Service Worker ---------- */
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },

      /* ---------- API – NEVER CACHE ---------- */
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },

  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default withPWA(nextConfig);
