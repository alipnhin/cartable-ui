/**
 * Signer Card Component
 * کامپوننت کارت امضادار با طراحی جدید
 */

"use client";

import { User } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatDate } from "@/lib/helpers";

interface SignerCardProps {
  signer: User;
  onRequestStatusChange: (signerId: string, currentStatus: boolean) => void;
}

export function SignerCard({ signer, onRequestStatusChange }: SignerCardProps) {
  const { t, locale } = useTranslation();

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return fullName.substring(0, 2);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="w-14 h-14 flex-shrink-0">
          <AvatarImage src={signer.avatar} alt={signer.fullName} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
            {getInitials(signer.fullName)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header: نام و نقش */}
          <div className="mb-3">
            <h4 className="font-semibold text-base mb-1 truncate">
              {signer.fullName}
            </h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              {signer.role}
            </p>
          </div>

          {/* اطلاعات تماس */}
          <div className="space-y-1.5 mb-3">
            {signer.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{signer.email}</span>
              </div>
            )}
            {signer.phoneNumber && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-mono">{signer.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>عضو از {formatDate(signer.createdAt, locale)}</span>
            </div>
          </div>

          {/* وضعیت و دکمه */}
          <div className="flex items-center gap-2 pt-3 border-t">
            <Badge
              variant={signer.isActive ? "success" : "secondary"}
              className="gap-1 flex-shrink-0"
            >
              {signer.isActive ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  فعال
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  غیرفعال
                </>
              )}
            </Badge>
            <Button
              variant={signer.isActive ? "destructive" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => onRequestStatusChange(signer.id, signer.isActive)}
            >
              {signer.isActive
                ? t("accounts.requestDeactivation") || "درخواست غیرفعال‌سازی"
                : t("accounts.requestActivation") || "درخواست فعال‌سازی"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
