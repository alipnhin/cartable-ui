import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,

  // استراتژی‌های cache
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 ساعت
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 روز
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 روز
        },
      },
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 دقیقه
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {},
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compress: true,

  experimental: {
    optimizePackageImports: ["@/components", "@/lib", "@/utils"],
    scrollRestoration: true,
  },

  async headers() {
    /**
     * Content Security Policy (CSP) Configuration
     *
     * فقط origin های مشخص شده در environment variables مجاز هستند.
     * این تنظیمات امنیت برنامه را در مقابل XSS و injection attacks افزایش می‌دهد.
     *
     * Allowed Origins:
     * - 'self': همان دامنه برنامه
     * - AUTH_ISSUER: Identity Server (احراز هویت)
     * - NEXT_PUBLIC_API_BASE_URL: Backend API
     * - localhost:* (فقط در development)
     */
    const allowedOrigins: string[] = ["'self'"];

    // Add Identity Server origin
    if (process.env.AUTH_ISSUER) {
      try {
        const authUrl = new URL(process.env.AUTH_ISSUER);
        allowedOrigins.push(authUrl.origin);
      } catch (e) {
        console.warn("Invalid AUTH_ISSUER URL:", process.env.AUTH_ISSUER);
      }
    }

    // Add API origin (extract from NEXT_PUBLIC_API_BASE_URL)
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      try {
        const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
        const apiOrigin = apiUrl.origin;
        // Only add if not already in list
        if (!allowedOrigins.includes(apiOrigin)) {
          allowedOrigins.push(apiOrigin);
        }
      } catch (e) {
        console.warn("Invalid NEXT_PUBLIC_API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      }
    }

    // In development, be more lenient with localhost
    if (process.env.NODE_ENV === "development") {
      allowedOrigins.push("http://localhost:*");
      allowedOrigins.push("https://localhost:*");
    }

    // Log allowed origins for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("[CSP] Allowed origins for connect-src:", allowedOrigins);
    }

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              `connect-src ${allowedOrigins.join(" ")}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
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
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  pageExtensions: ["ts", "tsx", "js", "jsx"],
  poweredByHeader: false,
};

export default withPWA(nextConfig);
