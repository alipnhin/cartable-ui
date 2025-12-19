/**
 * Group Table Component
 * کامپوننت جدول گروه‌های حساب برای دسکتاپ
 * Path: app/account-groups/components/group-table.tsx
 */

"use client";

import { useRouter } from "next/navigation";
import { Eye, Power, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
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
import type { AccountGroupDetail } from "@/types/account-group-types";
import useTranslation from "@/hooks/useTranslation";

interface GroupTableProps {
  groups: AccountGroupDetail[];
  onEdit: (group: AccountGroupDetail) => void;
  onToggleStatus: (group: AccountGroupDetail) => void;
  onDelete: (group: AccountGroupDetail) => void;
}

export function GroupTable({
  groups,
  onEdit,
  onToggleStatus,
  onDelete,
}: GroupTableProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  return (
    <div className="rounded-xl border-2 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20">
      <Table>
        <TableHeader className="bg-accent/60">
          <TableRow>
            <TableHead className="font-bold w-12"></TableHead>
            <TableHead className="font-bold">عنوان گروه</TableHead>
            <TableHead className="font-bold">شرح</TableHead>
            <TableHead className="text-center font-bold">تعداد حساب</TableHead>
            <TableHead className="text-center font-bold">وضعیت</TableHead>
            <TableHead className="text-center font-bold">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">گروهی یافت نشد</p>
              </TableCell>
            </TableRow>
          ) : (
            groups.map((group) => (
              <TableRow
                key={group.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/account-groups/${group.id}`)}
              >
                <TableCell className="w-12">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{
                      backgroundColor: `${group.color || "#360185"}20`,
                      color: group.color || "#360185",
                    }}
                  >
                    {getIcon(group.icon)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{group.title}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm text-muted-foreground">
                    {group.description || "-"}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" appearance="light">
                    {group.accountCount || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={group.isEnable ? "success" : "destructive"}
                    appearance="light"
                  >
                    {group.isEnable ? "فعال" : "غیرفعال"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div
                    className="flex justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => router.push(`/account-groups/${group.id}`)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>مشاهده</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => onToggleStatus(group)}
                    >
                      <Power className="h-3.5 w-3.5" />
                      <span>{group.isEnable ? "غیرفعال" : "فعال"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(group)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>حذف</span>
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
