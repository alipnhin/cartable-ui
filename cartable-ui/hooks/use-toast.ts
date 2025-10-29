/**
 * use-toast Hook
 * Hook برای نمایش toast notifications با استفاده از sonner
 */

import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "info";
}

export const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    switch (variant) {
      case "success":
        sonnerToast.success(title, {
          description,
        });
        break;
      case "error":
        sonnerToast.error(title, {
          description,
        });
        break;
      case "info":
        sonnerToast.info(title, {
          description,
        });
        break;
      default:
        sonnerToast(title, {
          description,
        });
    }
  };

  return { toast };
};
