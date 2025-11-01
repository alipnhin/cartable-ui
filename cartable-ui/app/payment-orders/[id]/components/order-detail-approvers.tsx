"use client";

import { Approver, SignatureProgress, ApprovalSummary } from "@/types/signer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { CheckCircle, XCircle, Clock, Users, TrendingUp } from "lucide-react";
import { ApproverStatus } from "@/types/signer";

interface OrderDetailApproversProps {
  approvers: Approver[];
  signatureProgress: SignatureProgress;
  approvalSummary: ApprovalSummary;
}

export function OrderDetailApprovers({
  approvers,
  signatureProgress,
  approvalSummary,
}: OrderDetailApproversProps) {
  const { t } = useTranslation();

  const getStatusIcon = (status: ApproverStatus) => {
    switch (status) {
      case ApproverStatus.Approved:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case ApproverStatus.Rejected:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case ApproverStatus.Pending:
        return <Clock className="h-5 w-5 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: ApproverStatus) => {
    switch (status) {
      case ApproverStatus.Approved:
        return (
          <Badge variant="secondary" className="bg-green-600">
            {t("approvers.approved")}
          </Badge>
        );
      case ApproverStatus.Rejected:
        return <Badge variant="destructive">{t("approvers.rejected")}</Badge>;
      case ApproverStatus.Pending:
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {t("approvers.pending")}
          </Badge>
        );
    }
  };

  const progressPercentage =
    (approvalSummary.approvedCount / approvalSummary.totalApprovers) * 100;

  return (
    <>
      <div className="space-y-6">
        {/* خلاصه امضا */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("approvers.signatureProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={progressPercentage} className="flex-1" />
              <span className="text-sm font-medium whitespace-nowrap">
                {approvalSummary.approvedCount} /{" "}
                {approvalSummary.totalApprovers}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {t("approvers.total")}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {approvalSummary.totalApprovers}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  {t("approvers.approved")}
                </p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {approvalSummary.approvedCount}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700">
                  {t("approvers.pending")}
                </p>
                <p className="text-2xl font-bold text-orange-700 mt-1">
                  {approvalSummary.pendingCount}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  {t("approvers.rejected")}
                </p>
                <p className="text-2xl font-bold text-red-700 mt-1">
                  {approvalSummary.rejectedCount}
                </p>
              </div>
            </div>

            {signatureProgress.isComplete && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {t("approvers.signatureComplete")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* لیست امضاکنندگان */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("approvers.approversList")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approvers.map((approver, index) => (
                <div
                  key={approver.userId}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* آواتار و شماره */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">
                        {index + 1}
                      </span>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {approver.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* اطلاعات */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium">{approver.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {approver.userName}
                        </p>
                      </div>
                      {getStatusBadge(approver.status)}
                    </div>

                    {/* جزئیات امضا */}
                    {approver.status !== ApproverStatus.Pending && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        {approver.createdDateTime && (
                          <div className="flex items-center gap-2">
                            {getStatusIcon(approver.status)}
                            <span>
                              {approver.status === ApproverStatus.Approved
                                ? t("approvers.approvedAt")
                                : t("approvers.rejectedAt")}
                              : {formatDate(approver.createdDateTime)}
                            </span>
                          </div>
                        )}
                        {approver.comment && (
                          <p className="text-xs bg-muted p-2 rounded mt-2">
                            {approver.comment}
                          </p>
                        )}
                      </div>
                    )}

                    {/* اگر pending است */}
                    {approver.status === ApproverStatus.Pending && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {t("approvers.waitingForApproval")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
