import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",

  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,

  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

    runtimeCaching: [
      // Navigation requests
      {
        urlPattern: ({ request, url }) => {
          return (
            request.mode === "navigate" && url.origin === self.location.origin
          );
        },
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60,
          },
          networkTimeoutSeconds: 5,
        },
      },

      // Images
      {
        urlPattern: ({ url }) => {
          return (
            url.origin === self.location.origin &&
            /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/i.test(url.pathname)
          );
        },
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
        },
      },

      // Next.js static assets
      {
        urlPattern: ({ url }) => {
          return (
            url.origin === self.location.origin &&
            url.pathname.startsWith("/_next/static/")
          );
        },
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },

      // JS/CSS
      {
        urlPattern: ({ url }) => {
          return (
            url.origin === self.location.origin &&
            /\.(?:js|css)$/i.test(url.pathname) &&
            !url.pathname.startsWith("/_next/static/")
          );
        },
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "js-css-cache",
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },

      // Fonts
      {
        urlPattern: ({ url }) => {
          return (
            url.origin === self.location.origin &&
            /\.(?:woff|woff2|ttf|eot)$/i.test(url.pathname)
          );
        },
        handler: "CacheFirst",
        options: {
          cacheName: "font-cache",
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
    ],

    navigateFallback: undefined,
    navigateFallbackDenylist: [/^\/api\//],
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

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
    const allowedOrigins = ["'self'"];

    // ✅ API Base URL از environment
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BFF_URL;
    if (apiBaseUrl) {
      try {
        const apiUrl = new URL(apiBaseUrl);
        allowedOrigins.push(apiUrl.origin);
      } catch (e) {
        console.warn("Invalid API URL:", apiBaseUrl);
      }
    }

    // ✅ Identity Server از environment
    const authIssuer =
      process.env.AUTH_ISSUER || process.env.NEXT_PUBLIC_AUTH_ISSUER;
    if (authIssuer) {
      try {
        const authUrl = new URL(authIssuer);
        if (!allowedOrigins.includes(authUrl.origin)) {
          allowedOrigins.push(authUrl.origin);
        }
      } catch (e) {
        console.warn("Invalid AUTH_ISSUER:", authIssuer);
      }
    }

    // Development only
    if (process.env.NODE_ENV === "development") {
      allowedOrigins.push("http://localhost:*");
      allowedOrigins.push("https://localhost:*");
    }

    const isDev = process.env.NODE_ENV === "development";

    // Log برای debugging
    console.log("[CSP] connect-src origins:", allowedOrigins);

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
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              isDev
                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
                : "script-src 'self' 'unsafe-inline'",
              isDev
                ? "style-src 'self' 'unsafe-inline'"
                : "style-src 'self' 'unsafe-inline'",
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

      // Static assets - aggressive caching
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

      // Images
      {
        source: "/:path*.{jpg,jpeg,png,gif,webp,svg,ico,avif}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },

      // Service Worker - NEVER cache
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },

      // Workbox runtime
      {
        source: "/workbox-:hash.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // API responses - NEVER cache
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
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
        minimize: true,
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            react: {
              name: "react-vendor",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            nextjs: {
              name: "nextjs-vendor",
              test: /[\\/]node_modules[\\/](next)[\\/]/,
              priority: 35,
              enforce: true,
            },
            ui: {
              name: "ui-vendor",
              test: /[\\/]node_modules[\\/](@radix-ui|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              priority: 30,
              enforce: true,
            },
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
              minChunks: 1,
              reuseExistingChunk: true,
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
