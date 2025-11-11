"use client";

import { OrderApprover } from "@/types/signer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { OrderApproveStatus } from "@/types/signer";

interface OrderDetailApproversProps {
  approvers: OrderApprover[];
}

export function OrderDetailApprovers({ approvers }: OrderDetailApproversProps) {
  const { t, locale } = useTranslation();

  const getStatusIcon = (status: OrderApproveStatus) => {
    switch (status) {
      case OrderApproveStatus.Accepted:
        return <CheckCircle className="h-5 w-5 text-success" />;
      case OrderApproveStatus.Rejected:
        return <XCircle className="h-5 w-5 text-destructive" />;
      case OrderApproveStatus.WaitForAction:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: OrderApproveStatus) => {
    switch (status) {
      case OrderApproveStatus.Accepted:
        return (
          <Badge className="bg-success text-white hover:bg-success/90">
            {t("approvers.approved")}
          </Badge>
        );
      case OrderApproveStatus.Rejected:
        return <Badge variant="destructive">{t("approvers.rejected")}</Badge>;
      case OrderApproveStatus.WaitForAction:
        return (
          <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
            {t("approvers.pending")}
          </Badge>
        );
    }
  };

  const getBorderColor = (status: OrderApproveStatus) => {
    switch (status) {
      case OrderApproveStatus.Accepted:
        return "border-success";
      case OrderApproveStatus.Rejected:
        return "border-destructive";
      case OrderApproveStatus.WaitForAction:
        return "border-warning";
      default:
        return "border-border";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {approvers.map((approver) => (
        <Card
          key={approver.signerId}
          className={`border-2 ${getBorderColor(
            approver.status
          )} transition-all hover:shadow-lg`}
        >
          <CardContent className="p-6">
            {/* بخش بالا: نام و یوزرنیم */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-foreground mb-1">
                {approver.approverName}
              </h3>
              <Badge variant="secondary" className="text-xs">
                امضادار مجاز
              </Badge>
            </div>

            {/* بخش وسط: وضعیت */}
            <div className="flex justify-center mb-4">
              {getStatusBadge(approver.status)}
            </div>

            {/* بخش پایین: جزئیات */}
            <div className="text-center">
              {approver.status !== OrderApproveStatus.WaitForAction ? (
                <>
                  <div className="flex items-center justify-center gap-2 text-sm mb-1">
                    {getStatusIcon(approver.status)}
                    <span className="font-medium">
                      {approver.status === OrderApproveStatus.Accepted
                        ? t("approvers.approved")
                        : t("approvers.rejected")}
                    </span>
                  </div>
                  {approver.createdDateTime && (
                    <div className="text-xs text-muted-foreground">
                      {formatDate(approver.createdDateTime, locale)}
                      <span className="mx-1">-</span>
                      {new Date(approver.createdDateTime).toLocaleTimeString(
                        locale,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2 text-sm mb-1 text-warning">
                    {getStatusIcon(approver.status)}
                    <span className="font-medium">منتظر بررسی</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    در انتظار تأیید یا رد
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
