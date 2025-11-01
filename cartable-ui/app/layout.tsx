"use client";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { DirectionProvider } from "@radix-ui/react-direction";
import { I18nProvider } from "@/providers/i18n-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipsProvider } from "@/providers/tooltips-provider";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstaller } from "@/components/common/pwa-installer";
import localFont from "next/font/local";
const yekanBakh = localFont({
  src: [
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/woff2/YekanBakhFaNum-ExtraBlack.woff2",
      weight: "950",
      style: "normal",
    },
  ],
  variable: "--font-yekanbakh",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      dir="rtl"
      className="light"
      lang="fa"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#27ae60" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="کارتابل" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={(cn("text-base antialiased "), `${yekanBakh.variable}`)}>
        <PWAInstaller />
        <ThemeProvider>
          <I18nProvider>
            <TooltipsProvider>
              <DirectionProvider dir="rtl">
                {children}
                <Toaster />
              </DirectionProvider>
            </TooltipsProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
