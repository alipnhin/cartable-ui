"use client";
import "@/styles/globals.css";
import "@/styles/themes.css";
import { cn } from "@/lib/utils";
import { DirectionProvider } from "@radix-ui/react-direction";
import { I18nProvider } from "@/providers/i18n-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ColorThemeProvider } from "@/providers/color-theme-provider";
import { TooltipsProvider } from "@/providers/tooltips-provider";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstaller } from "@/components/common/pwa-installer";
import { AppSplashLoader } from "@/components/common/app-splash-loader";
import { OfflineIndicator } from "@/components/common/offline-indicator";
import { SessionProvider } from "next-auth/react";
import { UnauthorizedHandler } from "@/components/auth/unauthorized-handler";
import { NavigationProgressProvider } from "@/providers/navigation-progress-provider";
import ErrorBoundary from "@/components/common/error-boundary";
import localFont from "next/font/local";

const yekanBakh = localFont({
  src: [
    { path: "../public/fonts/woff2/YekanBakhFaNum-Light.woff2", weight: "300" },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-SemiBold.woff2",
      weight: "600",
    },
    { path: "../public/fonts/woff2/YekanBakhFaNum-Bold.woff2", weight: "700" },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-ExtraBold.woff2",
      weight: "800",
    },
    { path: "../public/fonts/woff2/YekanBakhFaNum-Black.woff2", weight: "900" },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-ExtraBlack.woff2",
      weight: "950",
    },
  ],
  variable: "--font-yekanbakh",
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      dir="rtl"
      className="light"
      lang="fa"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* PWA Primary Meta Tags */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta
          name="description"
          content="سیستم مدیریت و تأیید دستورهای پرداخت"
        />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme Color */}
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0f2937"
        />
        <meta name="msapplication-TileColor" content="#FFFFFF" />

        {/* Apple Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/media/icons/web-app-manifest-512x512.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/media/icons/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          href="/media/icons/web-app-manifest-192x192.png"
        />

        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tadbir Pay" />

        {/* Mobile Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Tadbir Pay" />

        {/* Favicons */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/media/icons/icon-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/media/icons/icon-72x72.png"
        />

        {/* MS Tiles */}
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect for performance */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" /> */}
      </head>
      <body className={cn("text-base antialiased", yekanBakh.variable)}>
        <AppSplashLoader />
        <OfflineIndicator />
        <PWAInstaller />
        <ErrorBoundary>
          <SessionProvider>
            <UnauthorizedHandler />
            <ThemeProvider>
              <ColorThemeProvider>
                <I18nProvider>
                  <TooltipsProvider>
                    <DirectionProvider dir="rtl">
                      <NavigationProgressProvider>
                        {children}
                      </NavigationProgressProvider>
                      <Toaster />
                    </DirectionProvider>
                  </TooltipsProvider>
                </I18nProvider>
              </ColorThemeProvider>
            </ThemeProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
