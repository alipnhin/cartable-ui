"use client";

import { useParams } from "next/navigation";
import { getOrderDetailById } from "@/mocks/mockOrders";
import { OrderDetailHeader } from "./components/order-detail-header";
import { OrderDetailInfo } from "./components/order-detail-info";
import { OrderDetailTransactions } from "./components/order-detail-transactions";
import { OrderDetailApprovers } from "./components/order-detail-approvers";
import { OrderDetailHistory } from "./components/order-detail-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import useTranslation from "@/hooks/useTranslation";
import { ArrowRight, FileText, Users, History } from "lucide-react";
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
      {/* Header با دکمه‌های عملیاتی */}
      <OrderDetailHeader order={orderDetail} />

      {/* اطلاعات اصلی دستور */}
      <OrderDetailInfo order={orderDetail} />

      {/* تب‌های جزئیات */}
      <Tabs
        defaultValue="transactions"
        className="w-full text-muted-foreground"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("paymentOrders.transactions")}
            </span>
            <span className="sm:hidden">
              {t("paymentOrders.transactionsShort")}
            </span>
            <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
              {orderDetail.transactions.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="approvers" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("paymentOrders.approvers")}
            </span>
            <span className="sm:hidden">
              {t("paymentOrders.approversShort")}
            </span>
            <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
              {orderDetail.approvers.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("paymentOrders.history")}
            </span>
            <span className="sm:hidden">{t("paymentOrders.historyShort")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <OrderDetailTransactions transactions={orderDetail.transactions} />
        </TabsContent>

        <TabsContent value="approvers" className="mt-6">
          <OrderDetailApprovers
            approvers={orderDetail.approvers}
            signatureProgress={orderDetail.signatureProgress}
            approvalSummary={orderDetail.approvalSummary}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <OrderDetailHistory changeHistory={orderDetail.changeHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
