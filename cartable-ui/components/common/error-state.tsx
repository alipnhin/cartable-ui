"use client";

import { RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({
  title = "خطا در دریافت اطلاعات",
  message,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-100">
      <div className="text-center max-w-md px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <XCircle className="w-8 h-8 text-destructive" />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="primary" size="lg">
            <RefreshCw className="w-4 h-4 me-2" />
            تلاش مجدد
          </Button>
        )}
      </div>
    </div>
  );
}
