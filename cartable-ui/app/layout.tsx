"use client";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { DirectionProvider } from "@radix-ui/react-direction";
import { I18nProvider } from "@/providers/i18n-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipsProvider } from "@/providers/tooltips-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" suppressHydrationWarning>
      <body className={cn("text-base antialiased")}>
        <ThemeProvider>
          <I18nProvider>
            <TooltipsProvider>
              <DirectionProvider dir="rtl">{children}</DirectionProvider>
            </TooltipsProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
