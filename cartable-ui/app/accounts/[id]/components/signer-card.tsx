/**
 * Signer Card Component
 * کامپوننت کارت امضادار با طراحی مدرن و مینیمال
 */

"use client";

import { useState } from "react";
import { AccountUser } from "@/services/accountService";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  Calendar,
  Power,
  PowerOff,
  Clock,
  XCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatDate } from "@/lib/helpers";

// Status values (API returns string)
const SignerStatus = {
  EnableRequested: "EnableRequested",
  Enable: "Enable",
  Disable: "Disable",
  DisableRequested: "DisableRequested",
  Rejected: "Rejected",
} as const;

interface SignerCardProps {
  signer: AccountUser;
  onRequestStatusChange: (signerId: string, currentStatus: string | number) => void;
  isUpdating?: boolean;
}

export function SignerCard({
  signer,
  onRequestStatusChange,
  isUpdating = false,
}: SignerCardProps) {
  const { locale } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return fullName.substring(0, 2);
  };

  // Get status info based on status code (supports both string and number)
  const getStatusInfo = (status: string | number) => {
    // EnableRequested = 0 or "EnableRequested"
    if (status === 0 || status === "EnableRequested") {
      return {
        label: "در انتظار فعالسازی",
        color: "bg-yellow-500",
        badgeVariant: "warning" as const,
        badgeAppearance: "light" as const,
        icon: Clock,
      };
    }
    // Enable = 1 or "Enable"
    if (status === 1 || status === "Enable") {
      return {
        label: "فعال",
        color: "bg-green-500",
        badgeVariant: "success" as const,
        badgeAppearance: "light" as const,
        icon: CheckCircle2,
      };
    }
    // Disable = 2 or "Disable"
    if (status === 2 || status === "Disable") {
      return {
        label: "غیرفعال",
        color: "bg-gray-400",
        badgeVariant: "secondary" as const,
        badgeAppearance: "light" as const,
        icon: PowerOff,
      };
    }
    // DisableRequested = 3 or "DisableRequested"
    if (status === 3 || status === "DisableRequested") {
      return {
        label: "در انتظار غیرفعالسازی",
        color: "bg-orange-500",
        badgeVariant: "warning" as const,
        badgeAppearance: "light" as const,
        icon: Clock,
      };
    }
    // Rejected = 4 or "Rejected"
    if (status === 4 || status === "Rejected") {
      return {
        label: "رد شده",
        color: "bg-red-500",
        badgeVariant: "destructive" as const,
        badgeAppearance: "light" as const,
        icon: XCircle,
      };
    }
    // Default
    return {
      label: "نامشخص",
      color: "bg-gray-400",
      badgeVariant: "secondary" as const,
      badgeAppearance: "light" as const,
      icon: Clock,
    };
  };

  const statusInfo = getStatusInfo(signer.status);
  const isActive = signer.status === SignerStatus.Enable || signer.status === 1;

  const handleConfirm = () => {
    onRequestStatusChange(signer.id, signer.status);
    setShowConfirmDialog(false);
  };

  // Get action button info
  const getActionInfo = () => {
    const status = signer.status;
    if (status === SignerStatus.Enable || status === 1) {
      return {
        label: "غیرفعال‌سازی",
        icon: PowerOff,
        variant: "outline" as const,
        confirmTitle: "غیرفعال‌سازی امضادار",
        confirmDesc: `آیا مطمئن هستید که می‌خواهید "${signer.fullName}" را غیرفعال کنید؟ این کاربر دیگر قادر به امضای دستورات پرداخت نخواهد بود.`,
        confirmAction: "غیرفعال کن",
        confirmClass: "bg-destructive hover:bg-destructive/90",
      };
    } else if (
      status === SignerStatus.Disable ||
      status === SignerStatus.Rejected ||
      status === 2 ||
      status === 4
    ) {
      return {
        label: "فعال‌سازی",
        icon: Power,
        variant: "primary" as const,
        confirmTitle: "فعال‌سازی امضادار",
        confirmDesc: `آیا مطمئن هستید که می‌خواهید "${signer.fullName}" را فعال کنید؟ این کاربر قادر به امضای دستورات پرداخت خواهد شد.`,
        confirmAction: "فعال کن",
        confirmClass: "",
      };
    }
    return null;
  };

  const actionInfo = getActionInfo();

  return (
    <>
      <Card className="flex flex-col items-stretch">
        <CardContent className="grow p-4 flex flex-col items-center pt-6">
          {/* Avatar with status indicator */}
          <div className="mb-3">
            <div className="relative">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(signer.fullName)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex size-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 absolute bottom-0 start-10 transform -translate-y-1/2 ${statusInfo.color}`}
              />
            </div>
          </div>

          {/* Name */}
          <h4 className="font-medium text-sm text-center mb-1 truncate max-w-full">
            {signer.fullName}
          </h4>

          {/* Status Badge */}
          <Badge
            variant={statusInfo.badgeVariant}
            appearance={statusInfo.badgeAppearance}
            className="gap-1 mb-2"
          >
            <statusInfo.icon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>

          {/* Tenant */}
          <span className="text-muted-foreground text-xs mb-2 flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {signer.tenantName}
          </span>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(signer.createdDateTime, locale)}</span>
          </div>
        </CardContent>

        {actionInfo && (
          <CardFooter className="flex items-center px-4 min-h-12 border-t justify-center">
            <Button
              variant={actionInfo.variant}
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <actionInfo.icon className="h-3.5 w-3.5" />
              )}
              {actionInfo.label}
            </Button>
          </CardFooter>
        )}

        {!actionInfo && (
          <CardFooter className="flex items-center px-4 min-h-12 border-t justify-center">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              در انتظار تأیید
            </span>
          </CardFooter>
        )}
      </Card>

      {/* Confirmation Dialog */}
      {actionInfo && (
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{actionInfo.confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {actionInfo.confirmDesc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className={actionInfo.confirmClass}
              >
                {actionInfo.confirmAction}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
