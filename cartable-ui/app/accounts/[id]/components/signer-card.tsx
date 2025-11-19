/**
 * Signer Card Component
 * کامپوننت کارت امضادار با طراحی مدرن و مینیمال
 */

"use client";

import { useState } from "react";
import { AccountUser } from "@/services/accountService";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  CheckCircle2,
  Loader2,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatDate } from "@/lib/helpers";

interface SignerCardProps {
  signer: AccountUser;
  onRequestStatusChange: (signerId: string, currentStatus: boolean) => void;
  isUpdating?: boolean;
}

export function SignerCard({
  signer,
  onRequestStatusChange,
  isUpdating = false,
}: SignerCardProps) {
  const { t, locale } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isActive = signer.status === 1;

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return fullName.substring(0, 2);
  };

  const handleConfirm = () => {
    onRequestStatusChange(signer.id, isActive);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Card className="flex flex-col items-stretch">
        <CardContent className="grow p-5 flex flex-col items-center pt-8">
          {/* Avatar with status indicator */}
          <div className="mb-4">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {getInitials(signer.fullName)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex size-3 rounded-full ring-2 ring-white dark:ring-gray-800 absolute bottom-0 start-12 transform -translate-y-1/2 ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
          </div>

          {/* Name with status */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <h4 className="font-medium text-base">{signer.fullName}</h4>
            {isActive && (
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </div>

          {/* Tenant */}
          <span className="text-muted-foreground text-sm mb-3 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            {signer.tenantName}
          </span>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>عضو از {formatDate(signer.createdDateTime, locale)}</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center px-5 min-h-14 border-t justify-center">
          <Button
            variant={isActive ? "outline" : "default"}
            size="sm"
            className="gap-2"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isActive ? (
              <PowerOff className="h-4 w-4" />
            ) : (
              <Power className="h-4 w-4" />
            )}
            {isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? "غیرفعال‌سازی امضادار" : "فعال‌سازی امضادار"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? `آیا مطمئن هستید که می‌خواهید "${signer.fullName}" را غیرفعال کنید؟ این کاربر دیگر قادر به امضای دستورات پرداخت نخواهد بود.`
                : `آیا مطمئن هستید که می‌خواهید "${signer.fullName}" را فعال کنید؟ این کاربر قادر به امضای دستورات پرداخت خواهد شد.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={isActive ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {isActive ? "غیرفعال کن" : "فعال کن"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
