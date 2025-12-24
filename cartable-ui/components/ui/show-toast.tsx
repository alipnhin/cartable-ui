"use client";

import { toast } from "sonner";
import clsx from "clsx";
import { CircularToastProgress } from "./circular-toast-progress";

export type ToastVariant = "default" | "success" | "error" | "info";

const variantStyles: Record<ToastVariant, string> = {
  default: `
    border-border
    bg-background/90
    text-foreground
  `,
  success: `
    border-emerald-500/30
    bg-emerald-500/10
    text-emerald-700
    dark:text-emerald-400
    dark:bg-emerald-500/15
  `,
  error: `
    border-rose-500/30
    bg-rose-500/10
    text-rose-700
    dark:text-rose-400
    dark:bg-rose-500/15
  `,
  info: `
    border-sky-500/30
    bg-sky-500/10
    text-sky-700
    dark:text-sky-400
    dark:bg-sky-500/15
  `,
};

type ShowToastProps = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export function showToast({
  title,
  description,
  variant = "default",
  duration = 5000,
}: ShowToastProps) {
  toast.custom(
    (t) => (
      <div
        className={clsx(
          `
          relative
          flex items-start gap-4
          rounded-xl border
          backdrop-blur-md
          shadow-2xl
          p-4
          transition-all
          `,
          // Mobile width fix
          "w-[calc(100vw-1.5rem)] sm:max-w-sm mx-auto",
          variantStyles[variant]
        )}
      >
        <CircularToastProgress duration={duration} />

        <div className="flex-1">
          {title && (
            <p className="text-sm font-semibold leading-tight">{title}</p>
          )}
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        <button
          onClick={() => toast.dismiss(t)}
          className="text-muted-foreground hover:text-foreground transition"
        >
          ✕
        </button>
      </div>
    ),
    { duration }
  );
}
