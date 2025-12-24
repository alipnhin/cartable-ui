"use client";
import { showToast } from "../components/ui/show-toast";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "info";
  duration?: number;
}

export const useToast = () => {
  const toast = ({
    title,
    description,
    variant = "default",
    duration,
  }: ToastProps) => {
    showToast({
      title,
      description,
      variant,
      duration,
    });
  };

  return { toast };
};
