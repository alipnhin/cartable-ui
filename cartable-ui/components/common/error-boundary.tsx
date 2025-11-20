"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { RiErrorWarningLine, RiRefreshLine } from "@remixicon/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary کامپوننت
 * برای گرفتن و مدیریت خطاهای React در محیط production
 * از خرابی کل اپلیکیشن جلوگیری می‌کند و UI مناسبی نمایش می‌دهد
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // به‌روزرسانی state برای نمایش UI fallback
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // لاگ کردن خطا برای monitoring
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // در production می‌توانید خطا را به سرویس monitoring مثل Sentry ارسال کنید
    // if (process.env.NODE_ENV === "production") {
    //   logErrorToService(error, errorInfo);
    // }

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // اگر fallback سفارشی داده شده، از آن استفاده کن
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI پیش‌فرض برای نمایش خطا
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md">
            <div className="rounded-lg border border-destructive/50 bg-card p-6 shadow-lg">
              <div className="flex items-center gap-3 text-destructive mb-4">
                <RiErrorWarningLine className="h-6 w-6" />
                <h1 className="text-lg font-semibold">خطایی رخ داده است</h1>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                متأسفانه خطای غیرمنتظره‌ای در برنامه رخ داده است. لطفاً صفحه را
                بازنشانی کنید یا با پشتیبانی تماس بگیرید.
              </p>

              {/* نمایش جزئیات خطا فقط در محیط development */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-4 rounded bg-muted p-3 text-xs">
                  <summary className="cursor-pointer font-medium text-destructive mb-2">
                    جزئیات خطا (فقط در محیط توسعه)
                  </summary>
                  <div className="space-y-2">
                    <div>
                      <strong>پیام:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-all">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 whitespace-pre-wrap break-all text-[10px]">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap break-all text-[10px]">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-2">
                <button
                  onClick={this.handleReset}
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  تلاش مجدد
                </button>
                <button
                  onClick={this.handleReload}
                  className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <RiRefreshLine className="h-4 w-4" />
                  بارگذاری مجدد
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
