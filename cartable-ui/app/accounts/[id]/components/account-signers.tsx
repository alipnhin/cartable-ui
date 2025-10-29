/**
 * Account Signers Component
 * کامپوننت مدیریت امضاداران حساب
 */

"use client";

import { useState } from "react";
import { Account, User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Shield,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatDate } from "@/lib/helpers";

interface AccountSignersProps {
  account: Account;
  signers: User[];
}

export function AccountSigners({ account, signers }: AccountSignersProps) {
  const { t, locale } = useTranslation();
  const [activeSigners, setActiveSigners] = useState<Set<string>>(
    new Set(signers.filter((s) => s.isActive).map((s) => s.id))
  );

  const handleToggleSigner = (signerId: string) => {
    setActiveSigners((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(signerId)) {
        newSet.delete(signerId);
      } else {
        newSet.add(signerId);
      }
      return newSet;
    });
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return fullName.substring(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              امضاداران حساب
            </CardTitle>
            <Button size="sm">
              <UserPlus className="me-2 h-4 w-4" />
              افزودن امضادار
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{signers.length}</div>
                <div className="text-xs text-muted-foreground">
                  کل امضاداران
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {activeSigners.size}
                </div>
                <div className="text-xs text-muted-foreground">فعال</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {account.minimumSignatureCount}
                </div>
                <div className="text-xs text-muted-foreground">
                  حداقل مورد نیاز
                </div>
              </div>
            </div>
            {activeSigners.size < account.minimumSignatureCount && (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                امضاداران فعال کافی نیست
              </Badge>
            )}
            {activeSigners.size >= account.minimumSignatureCount && (
              <Badge variant="primary" className="gap-1 bg-success">
                <CheckCircle2 className="h-3 w-3" />
                تعداد امضادار کافی است
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signers List */}
      <div className="grid gap-4 md:grid-cols-2">
        {signers.map((signer, index) => {
          const isActive = activeSigners.has(signer.id);
          return (
            <Card key={signer.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={signer.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(signer.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{signer.fullName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {signer.role}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleToggleSigner(signer.id)}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  {signer.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{signer.email}</span>
                    </div>
                  )}
                  {signer.phoneNumber && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{signer.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>عضو از {formatDate(signer.createdAt, locale)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="me-2 h-3.5 w-3.5" />
                    مشاهده تاریخچه
                  </Button>
                  <Badge
                    variant={isActive ? "primary" : "secondary"}
                    className="px-3 py-1"
                  >
                    {isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {signers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              امضاداری تعریف نشده است
            </h3>
            <p className="text-muted-foreground mb-6">
              برای استفاده از این حساب، حداقل {account.minimumSignatureCount}{" "}
              امضادار نیاز است.
            </p>
            <Button>
              <UserPlus className="me-2 h-4 w-4" />
              افزودن امضادار جدید
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
