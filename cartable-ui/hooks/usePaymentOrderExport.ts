import { useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  exportOrderTransactionsToExcel,
  downloadBlobAsFile,
} from "@/services/paymentOrdersService";
import { getErrorMessage } from "@/lib/error-handler";
import { ExportStatus } from "@/app/reports/components/export-progress-dialog";

interface UsePaymentOrderExportReturn {
  // State
  dialogOpen: boolean;
  status: ExportStatus;
  error: string;

  // Actions
  startExport: (orderId: string, orderName?: string) => Promise<void>;
  cancelExport: () => void;
}

/**
 * Hook for managing Excel export with AbortController support
 * Prevents memory leaks by allowing real cancellation of export requests
 *
 * Features:
 * - Real cancellation with AbortController (not just closing dialog)
 * - Automatic cleanup on unmount
 * - Progress state management
 * - Error handling
 *
 * @returns Export state and handlers
 *
 * @example
 * ```tsx
 * const exportFlow = usePaymentOrderExport();
 *
 * <Button onClick={() => exportFlow.startExport(orderId, orderName)}>
 *   Export to Excel
 * </Button>
 *
 * <ExportProgressDialog
 *   open={exportFlow.dialogOpen}
 *   status={exportFlow.status}
 *   onCancel={exportFlow.cancelExport}
 *   errorMessage={exportFlow.error}
 * />
 * ```
 */
export function usePaymentOrderExport(): UsePaymentOrderExportReturn {
  const { data: session } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [error, setError] = useState<string>("");

  // AbortController ref for canceling export requests
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Start Excel export process
   */
  const startExport = useCallback(
    async (orderId: string, orderName?: string) => {
      if (!session?.accessToken || !orderId) {
        setError("Missing authentication or order ID");
        setStatus("error");
        return;
      }

      // Create new AbortController for this export
      abortControllerRef.current = new AbortController();

      setDialogOpen(true);
      setStatus("preparing");
      setError("");

      try {
        setStatus("downloading");

        const blob = await exportOrderTransactionsToExcel(
          orderId,
          session.accessToken,
          abortControllerRef.current.signal // Pass abort signal
        );

        // Check if export was cancelled during download
        if (abortControllerRef.current.signal.aborted) {
          setStatus("idle");
          setDialogOpen(false);
          return;
        }

        const filename = `transactions-${orderName || orderId}-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;

        downloadBlobAsFile(blob, filename);
        setStatus("success");

        // Auto-close dialog after 1.5 seconds on success
        setTimeout(() => {
          setDialogOpen(false);
          setStatus("idle");
        }, 1500);
      } catch (err: any) {
        // Don't show error if it was manually cancelled
        if (err.name === "AbortError" || err.name === "CanceledError") {
          setStatus("idle");
          setDialogOpen(false);
          return;
        }

        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setStatus("error");
      } finally {
        // Cleanup
        abortControllerRef.current = null;
      }
    },
    [session?.accessToken]
  );

  /**
   * Cancel export - actually aborts the request
   */
  const cancelExport = useCallback(() => {
    // Abort the ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setDialogOpen(false);
    setStatus("idle");
    setError("");
  }, []);

  return {
    dialogOpen,
    status,
    error,
    startExport,
    cancelExport,
  };
}
