import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60,
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
            maxAgeSeconds: 30 * 24 * 60 * 60,
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
            maxAgeSeconds: 7 * 24 * 60 * 60,
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
            maxAgeSeconds: 5 * 60,
          },
        },
      },
    ],
  },
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
    const allowedOrigins = ["'self'"];

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
        console.warn(
          "Invalid NEXT_PUBLIC_API_BASE_URL:",
          process.env.NEXT_PUBLIC_API_BASE_URL
        );
      }
    }

    // In development, be more lenient with localhost
    if (process.env.NODE_ENV === "development") {
      allowedOrigins.push("http://localhost:*");
      allowedOrigins.push("https://ecartableapi.etadbirco.ir:*");
      allowedOrigins.push("https://si-lab-tadbirpay.etadbir.com:*");
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
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Split large vendor libraries into separate chunks
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
