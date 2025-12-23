"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DetailLayoutProps {
  children: ReactNode;
  backUrl?: string;
  title?: string;
}

export function DetailLayout({ children, backUrl, title }: DetailLayoutProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header with Back Button */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="me-2 -ms-2 hover:bg-muted/80 active:scale-95 transition-all touch-manipulation"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            {title && (
              <h1 className="text-base font-semibold truncate flex-1">
                {title}
              </h1>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="pb-20">{children}</main>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isCollapsed={false} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
