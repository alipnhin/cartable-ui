"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MobilePagination({
  currentPage,
  totalPages,
  onPageChange,
}: MobilePaginationProps) {
  const { t, locale } = useTranslation();
  const isRTL = locale === "fa";

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-muted/30 rounded-lg border">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="md"
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        className="flex-1"
      >
        {isRTL ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
        <span className="ms-1">{t("common.pagination.previousPage")}</span>
      </Button>

      {/* Page Info */}
      <div className="flex items-center justify-center min-w-20">
        <span className="text-sm font-medium text-foreground">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="md"
        onClick={handleNext}
        disabled={!canGoNext}
        className="flex-1"
      >
        <span className="me-1">{t("common.pagination.nextPage")}</span>
        {isRTL ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
