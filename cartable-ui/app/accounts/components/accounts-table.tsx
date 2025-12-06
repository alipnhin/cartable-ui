/**
 * Accounts Table Component
 * کامپوننت جدول حساب‌های بانکی برای دسکتاپ
 */

"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BankLogo } from "@/components/common/bank-logo";
import { AccountListItem } from "@/services/accountService";
import useTranslation from "@/hooks/useTranslation";

interface AccountsTableProps {
  accounts: AccountListItem[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const formatIBAN = (iban: string) => {
    // IR12 0100 0012 3456 7890 1234 56
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="rounded-xl border-2 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20">
      <Table>
        <TableHeader className="bg-accent/60 font-bold">
          <TableRow>
            <TableHead className="font-bold w-12"></TableHead>
            <TableHead className="font-bold">
              {t("accounts.accountTitle")}
            </TableHead>
            <TableHead className="font-bold">
              {t("accounts.bankName")}
            </TableHead>
            <TableHead className="font-bold">
              {t("accounts.accountNumber")}
            </TableHead>
            <TableHead className="font-bold">{t("accounts.iban")}</TableHead>
            <TableHead className="text-center font-bold">
              {t("accounts.hasCartable")}
            </TableHead>
            <TableHead className="text-center font-bold">
              {t("common.status")}
            </TableHead>
            <TableHead className="text-center font-bold">
              {t("common.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <p className="text-muted-foreground">
                  {t("accounts.noAccountsFound")}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow
                key={account.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/accounts/${account.id}`)}
              >
                <TableCell className="w-12">
                  <BankLogo bankCode={account.bankCode} size="sm" />
                </TableCell>
                <TableCell className="font-medium">
                  {account.title}
                </TableCell>
                <TableCell>{account.bankName}</TableCell>
                <TableCell className="font-mono text-sm">
                  {account.accountNumber}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatIBAN(account.shebaNumber)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={account.hasCartable ? "success" : "secondary"}
                    appearance="light"
                  >
                    {account.hasCartable ? t("common.yes") : t("common.no")}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={account.isEnable ? "success" : "secondary"}
                    appearance="light"
                  >
                    {account.isEnable ? t("common.active") : t("common.inactive")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div
                    className="flex justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 gap-2"
                      onClick={() => router.push(`/accounts/${account.id}`)}
                      title={t("common.buttons.view")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden xl:inline">
                        {t("common.buttons.view")}
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
