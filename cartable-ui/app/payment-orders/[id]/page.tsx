"use client";

import { useParams } from "next/navigation";
import { getOrderDetailById } from "@/mocks/mockOrders";
import { OrderDetailHeader } from "./components/order-detail-header";
import { OrderDetailTransactions } from "./components/order-detail-transactions";
import { OrderDetailApprovers } from "./components/order-detail-approvers";
import { OrderDetailHistory } from "./components/order-detail-history";
import { OrderDetailStatistics } from "./components/order-detail-statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import useTranslation from "@/hooks/useTranslation";
import { ArrowRight, FileText, Users, History, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function PaymentOrderDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const orderId = params.id as string;

  const orderDetail = getOrderDetailById(orderId);

  if (!orderDetail) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">
            {t("paymentOrders.notFound")}
          </p>
          <Link
            href="/payment-orders"
            className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
          >
            <ArrowRight className="h-4 w-4" />
            {t("common.backToList")}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header با کارت‌های آماری */}
      <OrderDetailHeader order={orderDetail} />

      {/* تب‌های جزئیات */}
      <Tabs defaultValue="statistics" className="w-full space-y-6">
        {/* Tab Navigation */}
        <div className="rounded-lg border bg-card p-4">
          <TabsList className="w-full justify-center bg-transparent h-auto gap-3 flex-wrap">
            <TabsTrigger
              value="statistics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-3 gap-2 transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("paymentOrders.statistics")}
              </span>
              <span className="sm:hidden">
                {t("paymentOrders.statisticsShort")}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-3 gap-2 transition-all"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("paymentOrders.transactions")}
              </span>
              <span className="sm:hidden">
                {t("paymentOrders.transactionsShort")}
              </span>
              <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                {orderDetail.transactions.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="approvers"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-3 gap-2 transition-all"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("paymentOrders.approvers")}
              </span>
              <span className="sm:hidden">
                {t("paymentOrders.approversShort")}
              </span>
              <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                {orderDetail.approvers.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-3 gap-2 transition-all"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("paymentOrders.history")}
              </span>
              <span className="sm:hidden">
                {t("paymentOrders.historyShort")}
              </span>
              <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                {orderDetail.changeHistory.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents - هر کدام در Card مستقل */}
        <TabsContent value="statistics" className="mt-0">
          <Card className="p-6">
            <OrderDetailStatistics order={orderDetail} />
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <Card className="p-6">
            <OrderDetailTransactions transactions={orderDetail.transactions} />
          </Card>
        </TabsContent>

        <TabsContent value="approvers" className="mt-0">
          <Card className="p-6">
            <OrderDetailApprovers
              approvers={orderDetail.approvers}
              signatureProgress={orderDetail.signatureProgress}
              approvalSummary={orderDetail.approvalSummary}
            />
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="p-6">
            <OrderDetailHistory changeHistory={orderDetail.changeHistory} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
