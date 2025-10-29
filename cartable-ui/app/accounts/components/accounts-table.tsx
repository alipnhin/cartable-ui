/**
 * Accounts Table Component
 * کامپوننت جدول حساب‌های بانکی برای دسکتاپ
 */

"use client";

import { useRouter } from "next/navigation";
import { Eye, Edit, Users } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Account } from "@/types";
import useTranslation from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/helpers";

interface AccountsTableProps {
  accounts: Account[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();

  const formatIBAN = (iban: string) => {
    // IR12 0100 0012 3456 7890 1234 56
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div
      className="rounded-xl border bg-card overflow-hidden"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("accounts.accountTitle")}</TableHead>
            <TableHead>{t("accounts.bankName")}</TableHead>
            <TableHead>{t("accounts.accountNumber")}</TableHead>
            <TableHead>{t("accounts.iban")}</TableHead>
            <TableHead className="text-center">
              {t("accounts.balance")}
            </TableHead>
            <TableHead className="text-center">
              {t("accounts.minSignatures")}
            </TableHead>
            <TableHead className="text-center">
              {t("accounts.signersCount")}
            </TableHead>
            <TableHead className="text-center">{t("common.status")}</TableHead>
            <TableHead className="text-center">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
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
                <TableCell className="font-medium">
                  {account.accountTitle}
                </TableCell>
                <TableCell>{account.bankName}</TableCell>
                <TableCell className="font-mono text-sm">
                  {account.accountNumber}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {formatIBAN(account.sheba)}
                </TableCell>
                <TableCell className="text-end font-semibold">
                  {formatCurrency(account.balance ?? 0, locale)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">
                    {account.minimumSignatureCount}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{account.signerIds.length}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={account.isActive}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => {
                      // Mock: در اینجا باید تغییر وضعیت انجام شود
                      console.log("Toggle account status:", account.id);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div
                    className="flex justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/accounts/${account.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        router.push(`/accounts/${account.id}?tab=signers`)
                      }
                    >
                      <Users className="h-4 w-4" />
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
