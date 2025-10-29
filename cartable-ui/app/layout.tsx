"use client";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { DirectionProvider } from "@radix-ui/react-direction";
import { I18nProvider } from "@/providers/i18n-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipsProvider } from "@/providers/tooltips-provider";
import { Toaster } from "@/components/ui/sonner";
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
    <html dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={(cn("text-base antialiased"), `${yekanBakh.variable}`)}>
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
