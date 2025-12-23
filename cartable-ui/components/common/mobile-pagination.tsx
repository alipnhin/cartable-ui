"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function MobilePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  className,
}: MobilePaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={cn("space-y-3", className)}>
      {/* نمایش اطلاعات صفحه‌بندی */}
      {totalItems !== undefined && (
        <div className="text-center text-sm text-muted-foreground">
          {t("common.pagination.showing")}{" "}
          <span className="font-medium text-foreground">
            {(currentPage - 1) * pageSize + 1}
          </span>{" "}
          {t("common.pagination.to")}{" "}
          <span className="font-medium text-foreground">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{" "}
          {t("common.pagination.of")}{" "}
          <span className="font-medium text-foreground">{totalItems}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* دکمه قبلی */}
        <Button
          variant="outline"
          size="md"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="flex-1"
        >
          <ChevronRight className="h-4 w-4 me-2" />
          {t("common.pagination.previousPage")}
        </Button>

        {/* نمایش صفحه فعلی */}
        <div className="text-sm font-medium text-muted-foreground whitespace-nowrap px-2">
          {currentPage} / {totalPages}
        </div>

        {/* دکمه بعدی */}
        <Button
          variant="outline"
          size="md"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="flex-1"
        >
          {t("common.pagination.nextPage")}
          <ChevronLeft className="h-4 w-4 ms-2" />
        </Button>
      </div>
    </div>
  );
}
