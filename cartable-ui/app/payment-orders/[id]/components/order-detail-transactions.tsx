"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  StatusBadge,
  TransactionStatusBadge,
} from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { Search, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderDetailTransactionsProps {
  transactions: Transaction[];
}

export function OrderDetailTransactions({
  transactions,
}: OrderDetailTransactionsProps) {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  // فیلتر کردن تراکنش‌ها
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.destinationIban?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.trackingId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    // Export logic
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">
            {t("paymentOrders.transactionsList")} ({filteredTransactions.length}
            )
          </CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pe-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          // نمایش کارتی در موبایل
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <Card key={transaction.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">
                      {index + 1}. {transaction.ownerName}
                    </span>
                    <TransactionStatusBadge
                      status={transaction.status}
                      size="sm"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>{t("transactions.amount")}:</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(transaction.amount, locale)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("transactions.iban")}:</span>
                      <span className="font-mono text-xs">
                        {transaction.destinationIban}
                      </span>
                    </div>
                    {transaction.trackingId && (
                      <div className="flex justify-between">
                        <span>{t("transactions.trackingId")}:</span>
                        <span className="font-mono text-xs">
                          {transaction.trackingId}
                        </span>
                      </div>
                    )}
                    {transaction.description && (
                      <div>
                        <span>{t("transactions.description")}:</span>
                        <p className="text-xs mt-0.5">
                          {transaction.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // نمایش جدولی در دسکتاپ
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t("transactions.ownerName")}</TableHead>
                  <TableHead>{t("transactions.iban")}</TableHead>
                  <TableHead className="text-left">
                    {t("transactions.amount")}
                  </TableHead>
                  <TableHead>{t("transactions.description")}</TableHead>
                  <TableHead>{t("transactions.trackingId")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.ownerName}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.destinationIban}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {formatCurrency(transaction.amount, locale)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {transaction.description || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.trackingId || "-"}
                    </TableCell>
                    <TableCell>
                      <TransactionStatusBadge
                        status={transaction.status}
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t("common.noResults")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
