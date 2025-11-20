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
  RiAndroidLine,
  RiMoreLine,
  RiShareLine,
  RiHomeLine,
} from "@remixicon/react";

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
  const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;
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
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          logger.info("Service Worker registered:", registration);
        })
        .catch((error) => {
          logger.error("Service Worker registration failed:", error);
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
        (new Date().getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
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

      logger.info("User choice:", outcome);

      if (outcome === "accepted") {
        setShowInstallPrompt(false);
      }

      setDeferredPrompt(null);
    } catch (error) {
      logger.error("Error during installation:", error);
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
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <div className="rounded-lg border border-border bg-card p-4 shadow-lg animate-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <RiDownloadLine className="h-6 w-6 text-primary-foreground" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">
                {t("pwa.installApp")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("pwa.description")}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    <RiAndroidLine className="h-4 w-4" />
                    {t("pwa.install")}
                  </span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
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
              <RiCloseLine className="h-5 w-5" />
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
        <div className="w-full max-w-lg rounded-t-2xl bg-card p-6 shadow-xl animate-in slide-in-from-bottom-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <RiAppleLine className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-card-foreground">
                  {t("pwa.installApp")}
                </h3>
                <p className="text-sm text-muted-foreground">{t("pwa.iosSubtitle")}</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t("pwa.close")}
            >
              <RiCloseLine className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("pwa.iosIntro")}
            </p>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex gap-3 rounded-lg bg-accent/50 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  ۱
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">
                    {t("pwa.iosStep1Title")}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">
                      {t("pwa.iosStep1Tap")}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500">
                      <RiShareLine className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs">
                      {t("pwa.iosStep1At")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 rounded-lg bg-accent/50 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  ۲
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">
                    {t("pwa.iosStep2Title")}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">
                      {t("pwa.iosStep2Select")}
                    </span>
                    <div className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1 dark:bg-gray-700">
                      <RiHomeLine className="h-3 w-3" />
                      <span className="text-xs">Add to Home Screen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 rounded-lg bg-accent/50 p-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  ۳
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">
                    {t("pwa.iosStep3Title")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("pwa.iosStep3Desc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <div className="flex gap-2">
                <RiAppleLine className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>{t("pwa.iosNoteTitle")}</strong> {t("pwa.iosNoteDesc")}
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="w-full rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
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
