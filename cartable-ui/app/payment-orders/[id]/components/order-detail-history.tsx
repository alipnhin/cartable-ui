"use client";

import { ChangeHistoryEntry } from "@/types/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import {
  Clock,
  FileEdit,
  CheckCircle,
  XCircle,
  Send,
  UserPlus,
  History as HistoryIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderDetailHistoryProps {
  changeHistory: ChangeHistoryEntry[];
}

export function OrderDetailHistory({ changeHistory }: OrderDetailHistoryProps) {
  const { t } = useTranslation();

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <FileEdit className="h-5 w-5 text-blue-600" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "submitted":
        return <Send className="h-5 w-5 text-purple-600" />;
      case "signer_added":
        return <UserPlus className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "created":
        return <Badge variant="secondary">{t("history.created")}</Badge>;
      case "approved":
        return (
          <Badge variant="primary" className="bg-green-600">
            {t("history.approved")}
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">{t("history.rejected")}</Badge>;
      case "submitted":
        return (
          <Badge variant="primary" className="bg-purple-600">
            {t("history.submitted")}
          </Badge>
        );
      case "signer_added":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {t("history.signerAdded")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          {t("paymentOrders.changeHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {changeHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("history.noHistory")}
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="relative">
              {/* خط تایم‌لاین */}
              <div className="absolute right-[21px] top-2 bottom-2 w-px bg-border" />

              {/* لیست رویدادها */}
              <div className="space-y-4">
                {changeHistory.map((entry, index) => (
                  <div key={entry.id} className="relative flex gap-4">
                    {/* نقطه تایم‌لاین */}
                    <div className="relative flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-border">
                        {getActionIcon(entry.title)}
                      </div>
                    </div>

                    {/* محتوای رویداد */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {getActionBadge(entry.Status)}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(entry.createdDateTime)}
                              </span>
                            </div>
                            <p className="font-medium">{entry.description}</p>
                          </div>
                        </div>

                        {/* جزئیات کاربر */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">
                              {entry.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {entry.userName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {entry.userName}
                            </p>
                          </div>
                        </div>

                        {/* نظر یا توضیحات */}
                        {entry.description && (
                          <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                            <p className="text-xs text-muted-foreground mb-1">
                              {t("history.comment")}:
                            </p>
                            <p>{entry.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
