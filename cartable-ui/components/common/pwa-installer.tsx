/**
 * PWA Installer Component
 * کامپوننت نصب Progressive Web App
 *
 * این کامپوننت راهنمای نصب اپلیکیشن را برای Android و iOS نمایش می‌دهد.
 * - Android Chrome: نصب با یک کلیک
 * - iOS Safari: راهنمای گام به گام
 *
 * @module components/common/pwa-installer
 */

"use client";

import { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import logger from "@/lib/logger";
import {
  RiDownloadLine,
  RiCloseLine,
  RiAppleLine,
  RiAddBoxLine,
} from "@remixicon/react";
import { Share } from "lucide-react";
// Type برای BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// تشخیص نوع دستگاه و سیستم عامل
const getDeviceInfo = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isChrome = /chrome/.test(userAgent);
  const isInStandaloneMode = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;
  // @ts-ignore
  const isInPWA = window.navigator.standalone === true || isInStandaloneMode;

  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isInPWA,
    canInstallPWA: (isAndroid && isChrome) || (isIOS && isSafari),
  };
};

export function PWAInstaller() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isInPWA: false,
    canInstallPWA: false,
  });

  useEffect(() => {
    // Register service worker only in production or when PWA is enabled
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          logger.info("Service Worker registered");
        })
        .catch((error) => {
          logger.error(
            "Service Worker registration failed:",
            error instanceof Error ? error : undefined
          );
        });
    } else if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "development"
    ) {
      // In development, unregister any existing service workers to prevent caching issues
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          logger.info("Unregistered service worker in development mode");
        }
      });
    }

    // Get device info
    const info = getDeviceInfo();
    setDeviceInfo(info);

    // اگر قبلاً نصب شده یا در حالت PWA است، چیزی نشان نده
    if (info.isInPWA) {
      logger.info("App is already installed as PWA");
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed =
        (new Date().getTime() - dismissedDate.getTime()) /
        (1000 * 60 * 60 * 24);
      // نشان دادن دوباره بعد از 7 روز
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Handle install prompt برای Android Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      logger.info("beforeinstallprompt event fired");
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // نمایش پیام نصب بعد از 3 ثانیه
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // برای iOS Safari
    if (info.isIOS && info.isSafari && info.canInstallPWA) {
      // نمایش دستورالعمل iOS بعد از 3 ثانیه
      setTimeout(() => {
        setShowIOSInstructions(true);
      }, 3000);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    // Handle successful installation
    window.addEventListener("appinstalled", () => {
      logger.info("PWA was installed successfully");
      setShowInstallPrompt(false);
      setShowIOSInstructions(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  // نصب برای Android
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      logger.info(`User choice: ${outcome}`);

      if (outcome === "accepted") {
        setShowInstallPrompt(false);
      }

      setDeferredPrompt(null);
    } catch (error) {
      logger.error(
        "Error during installation:",
        error instanceof Error ? error : undefined
      );
    }
  };

  // بستن پیام و ذخیره در localStorage
  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
  };

  // اگر نصب شده یا نمی‌خواهیم نشان دهیم
  if (deviceInfo.isInPWA || (!showInstallPrompt && !showIOSInstructions)) {
    return null;
  }

  // Android Chrome Install Prompt
  if (showInstallPrompt && deferredPrompt && deviceInfo.isAndroid) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
        <div className="rounded-lg border border-border bg-card p-4 shadow-lg animate-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <RiDownloadLine className="h-5 w-5 text-primary-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-card-foreground">
                {t("pwa.installApp")}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {t("pwa.description")}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t("pwa.install")}
                </button>
                <button
                  onClick={handleDismiss}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                >
                  {t("pwa.later")}
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t("pwa.close")}
            >
              <RiCloseLine className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS Safari Install Instructions
  if (showIOSInstructions && deviceInfo.isIOS && deviceInfo.isSafari) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-in fade-in">
        <div className="w-full max-w-md rounded-t-2xl bg-card p-6 shadow-xl animate-in slide-in-from-bottom-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <RiAppleLine className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground">
                {t("pwa.installApp")}
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t("pwa.close")}
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex gap-3 items-center">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                ۱
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>فشردن دکمه</span>
                <Share className="h-4 w-4 text-blue-500" />
                <span>در پایین صفحه</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 items-center">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                ۲
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>انتخاب</span>
                <div className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
                  <RiAddBoxLine className="h-3 w-3" />
                  <span className="text-xs">Add to Home Screen</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 items-center">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                ۳
              </div>
              <span className="text-sm">تایید نصب</span>
            </div>

            <button
              onClick={handleDismiss}
              className="w-full mt-4 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("pwa.understood")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
