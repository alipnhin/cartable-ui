"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileSpreadsheet, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type ExportStatus = "idle" | "preparing" | "downloading" | "success" | "error";

interface ExportProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: ExportStatus;
  totalRecords: number;
  onCancel?: () => void;
  errorMessage?: string;
}

export function ExportProgressDialog({
  open,
  onOpenChange,
  status,
  totalRecords,
  onCancel,
  errorMessage,
}: ExportProgressDialogProps) {
  const [progress, setProgress] = useState(0);

  // Simulate progress animation
  useEffect(() => {
    if (status === "preparing") {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 60) {
            clearInterval(timer);
            return 60;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(timer);
    } else if (status === "downloading") {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 3;
        });
      }, 100);
      return () => clearInterval(timer);
    } else if (status === "success") {
      setProgress(100);
    } else if (status === "error") {
      setProgress(0);
    }
  }, [status]);

  const getStatusInfo = () => {
    switch (status) {
      case "preparing":
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: "در حال آماده‌سازی فایل",
          description: `در حال پردازش ${totalRecords.toLocaleString("fa-IR")} تراکنش...`,
        };
      case "downloading":
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: "در حال دانلود",
          description: "فایل اکسل در حال دانلود است...",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-600" />,
          title: "دانلود موفق",
          description: "فایل اکسل با موفقیت دانلود شد",
        };
      case "error":
        return {
          icon: <XCircle className="h-12 w-12 text-red-600" />,
          title: "خطا در دانلود",
          description: errorMessage || "خطا در دانلود فایل اکسل",
        };
      default:
        return {
          icon: <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />,
          title: "خروجی اکسل",
          description: "",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const isInProgress = status === "preparing" || status === "downloading";

  return (
    <Dialog open={open} onOpenChange={isInProgress ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">خروجی اکسل</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          {statusInfo.icon}

          <div className="text-center space-y-1">
            <p className="font-medium">{statusInfo.title}</p>
            <p className="text-sm text-muted-foreground">
              {statusInfo.description}
            </p>
          </div>

          {isInProgress && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {progress}%
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            {isInProgress && onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                لغو
              </Button>
            )}
            {(status === "success" || status === "error") && (
              <Button size="sm" onClick={() => onOpenChange(false)}>
                بستن
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
