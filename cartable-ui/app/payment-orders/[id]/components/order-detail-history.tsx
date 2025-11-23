"use client";

import { WithdrawalChangeHistory, PaymentStatusEnum } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle,
  Ban,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/ui/status-badge";

interface OrderDetailHistoryProps {
  changeHistory: WithdrawalChangeHistory[];
}

export function OrderDetailHistory({ changeHistory }: OrderDetailHistoryProps) {
  const { t, locale } = useTranslation();

  const getStatusIcon = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Draft:
        return <FileEdit className="h-5 w-5 text-gray-600" />;
      case PaymentStatusEnum.WaitingForOwnersApproval:
        return <Clock className="h-5 w-5 text-blue-600" />;
      case PaymentStatusEnum.OwnersApproved:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case PaymentStatusEnum.OwnerRejected:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case PaymentStatusEnum.SubmittedToBank:
        return <Send className="h-5 w-5 text-purple-600" />;
      case PaymentStatusEnum.BankSucceeded:
        return <CheckCircle className="h-5 w-5 text-success" />;
      case PaymentStatusEnum.DoneWithError:
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case PaymentStatusEnum.BankRejected:
        return <XCircle className="h-5 w-5 text-destructive" />;
      case PaymentStatusEnum.Canceled:
        return <Ban className="h-5 w-5 text-muted-foreground" />;
      case PaymentStatusEnum.Expired:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  // Sort by date descending (most recent first)
  const sortedHistory = [...changeHistory].sort(
    (a, b) =>
      new Date(b.createdDateTime).getTime() -
      new Date(a.createdDateTime).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          {t("paymentOrders.changeHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("history.noHistoryAvailable")}
          </div>
        ) : (
          <div className="relative">
            {/* لیست رویدادها */}
            <div className="space-y-4">
              {sortedHistory.map((entry, index) => (
                <div className="flex items-start relative" key={entry.id}>
                  {/* خط عمودی اتصال */}
                  {index < sortedHistory.length - 1 && (
                    <div className="w-9 start-0 top-9 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s border-s-input"></div>
                  )}

                  {/* آیکون وضعیت */}
                  <div className="flex items-center justify-center bg-accent/60 shrink-0 rounded-full border border-input size-9 text-secondary-foreground z-10">
                    {getStatusIcon(entry.status)}
                  </div>

                  {/* محتوای تاریخچه */}
                  <div className="ps-2.5 mb-7 text-base grow">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <OrderStatusBadge status={entry.status as any} size="default" />
                      </div>
                      <div className="text-sm mb-2 font-medium">
                        {entry.description || t("history.noDescription")}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDate(entry.createdDateTime, locale)}</span>
                        <span>
                          {new Date(entry.createdDateTime).toLocaleTimeString(
                            locale,
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
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
