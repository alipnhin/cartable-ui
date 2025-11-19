"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import type { TransactionProgressResponse } from "@/types/dashboard";
import { exportDashboardToExcel } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";
import useTranslation from "@/hooks/useTranslation";

interface ExportButtonsProps {
  data: TransactionProgressResponse;
  filters: {
    bankGatewayId?: string;
    fromDate?: string;
    toDate?: string;
  };
}

export default function ExportButtons({ data, filters }: ExportButtonsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const fileName = exportDashboardToExcel(data, filters);
      toast({
        title: t("dashboard.export.success"),
        description: t("dashboard.export.fileCreated", { fileName }),
        variant: "success",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: t("dashboard.export.error"),
        description: t("dashboard.export.excelError"),
        variant: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={isExporting}
      onClick={handleExportExcel}
    >
      <FileSpreadsheet className="w-4 h-4" />
      {isExporting ? t("dashboard.export.creating") : t("dashboard.export.downloadExcel")}
    </Button>
  );
}
