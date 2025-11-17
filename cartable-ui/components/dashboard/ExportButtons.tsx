"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TransactionProgressResponse } from "@/types/dashboard";
import { exportDashboardToExcel, exportDashboardToPDF } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";

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
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const fileName = exportDashboardToExcel(data, filters);
      toast({
        title: "موفق",
        description: `فایل ${fileName} با موفقیت ایجاد شد`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "خطا",
        description: "خطا در ایجاد فایل Excel",
        variant: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = exportDashboardToPDF(data, filters);
      toast({
        title: "موفق",
        description: `فایل ${fileName} با موفقیت ایجاد شد`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "خطا",
        description: "خطا در ایجاد فایل PDF",
        variant: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          disabled={isExporting}
        >
          <Download className="w-4 h-4" />
          {isExporting ? "در حال ایجاد..." : "دریافت گزارش"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-success" />
          دریافت Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4 text-destructive" />
          دریافت PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
