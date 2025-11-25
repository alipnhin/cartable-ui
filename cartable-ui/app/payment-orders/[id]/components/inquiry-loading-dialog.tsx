"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface InquiryLoadingDialogProps {
  open: boolean;
  type: "order" | "transaction";
}

export function InquiryLoadingDialog({
  open,
  type,
}: InquiryLoadingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {type === "order" ? "استعلام دستور پرداخت" : "استعلام تراکنش"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {type === "order"
              ? "استعلام از بانک در حال انجام است. لطفاً صبر کنید..."
              : "استعلام وضعیت تراکنش از بانک در حال انجام است..."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            این عملیات ممکن است چند لحظه طول بکشد
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
