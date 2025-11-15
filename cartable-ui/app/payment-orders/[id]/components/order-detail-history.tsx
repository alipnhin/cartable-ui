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
import { OrderStatusBadge, StatusBadge } from "@/components/ui/status-badge";

interface OrderDetailHistoryProps {
  changeHistory: ChangeHistoryEntry[];
}

export function OrderDetailHistory({ changeHistory }: OrderDetailHistoryProps) {
  const { t, locale } = useTranslation();

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
          <div className="relative">
            {/* لیست رویدادها */}
            <div className="space-y-4">
              {changeHistory.map((entry, index) => (
                <div className="flex items-start relative" key={entry.id}>
                  <div className="w-9 start-0 top-9 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s border-s-input"></div>

                  <div className="flex items-center justify-center bg-accent/60 shrink-0 rounded-full  border border-input size-9 text-secondary-foreground">
                    {getActionIcon(entry.title)}
                  </div>
                  <div className="ps-2.5 mb-7 text-base grow">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <OrderStatusBadge
                          status={entry.Status}
                          size="default"
                        />
                      </div>
                      <div className="text-sm text-mono mb-2 font-bold">
                        {entry.description}
                      </div>
                      <span className="text-xs text-secondary-foreground">
                        {formatDate(entry.createdDateTime, locale)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
