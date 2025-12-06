/**
 * Group Card Component
 * کامپوننت کارت نمایش گروه حساب
 */

"use client";

import { useRouter } from "next/navigation";
import { Eye, Power, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AccountGroupDetail } from "@/types/account-group-types";
import useTranslation from "@/hooks/useTranslation";

interface GroupCardProps {
  group: AccountGroupDetail;
  onEdit: (group: AccountGroupDetail) => void;
  onToggleStatus: (group: AccountGroupDetail) => void;
  onDelete: (group: AccountGroupDetail) => void;
}

export function GroupCard({
  group,
  onEdit,
  onToggleStatus,
  onDelete,
}: GroupCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-6 w-6" /> : null;
  };

  const accountCount = group.items?.length || 0;

  return (
    <div className="group rounded-xl border-2 bg-card transition-all duration-200 hover:shadow-lg hover:border-primary/20 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div
          className="flex items-start gap-3 mb-4 cursor-pointer"
          onClick={() => router.push(`/account-groups/${group.id}`)}
        >
          {/* آیکون */}
          <div
            className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg"
            style={{
              backgroundColor: `${group.color || "#360185"}15`,
              color: group.color || "#360185",
            }}
          >
            {getIcon(group.icon)}
          </div>

          {/* عنوان و توضیحات */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate mb-1">
              {group.title}
            </h3>
            {group.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {group.description}
              </p>
            )}
          </div>
        </div>
        {/* تعداد حساب و وضعیت */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">تعداد حساب:</span>
            <Badge variant="secondary" appearance="light">
              {accountCount}
            </Badge>
          </div>
          <div className="h-3 w-px bg-border" />
          <Badge
            variant={group.isEnable ? "success" : "destructive"}
            appearance="light"
          >
            {group.isEnable ? "فعال" : "غیرفعال"}
          </Badge>
        </div>
        {/* Footer: آمار و دکمه‌ها */}
        <div className="space-y-3 pt-3 border-t">
          {/* دکمه‌های عملیات */}
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/account-groups/${group.id}`);
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>مشاهده</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(group);
              }}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{group.isEnable ? "غیرفعال" : "فعال"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(group);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>حذف</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
