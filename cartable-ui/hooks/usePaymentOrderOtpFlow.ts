import { useState, useCallback } from "react";
import { OperationTypeEnum } from "@/types/api";
import { usePaymentOrderActions } from "./usePaymentOrderActions";
import { useToast } from "@/hooks/use-toast";
import useTranslation from "@/hooks/useTranslation";
import { getErrorMessage } from "@/lib/error-handler";

type OtpFlowType = "approve" | "reject";

interface OtpDialogState {
  open: boolean;
  type: OtpFlowType;
  isRequestingOtp: boolean;
}

interface UsePaymentOrderOtpFlowReturn {
  // State
  otpDialog: OtpDialogState;

  // Actions
  startApproveFlow: () => void;
  startRejectFlow: () => void;
  confirmOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  closeDialog: () => void;
}

/**
 * Hook for managing OTP flow for payment order approval/rejection
 * Encapsulates all OTP-related state and logic
 *
 * Features:
 * - Generic OTP flow for both approve and reject actions
 * - Automatic state management (requesting OTP, entering code, success/error)
 * - Toast notifications for all states
 * - Type-safe operation handling
 *
 * @param orderId - Payment order ID
 * @returns OTP flow state and handlers
 *
 * @example
 * ```tsx
 * const otpFlow = usePaymentOrderOtpFlow(orderId);
 *
 * // Start approve flow
 * <Button onClick={otpFlow.startApproveFlow}>Approve</Button>
 *
 * // OTP Dialog
 * <OtpDialog
 *   open={otpFlow.otpDialog.open}
 *   onOpenChange={otpFlow.closeDialog}
 *   onConfirm={otpFlow.confirmOtp}
 *   onResend={otpFlow.resendOtp}
 *   isRequestingOtp={otpFlow.otpDialog.isRequestingOtp}
 * />
 * ```
 */
export function usePaymentOrderOtpFlow(
  orderId: string
): UsePaymentOrderOtpFlowReturn {
  const { toast } = useToast();
  const { t } = useTranslation();
  const actions = usePaymentOrderActions(orderId);

  const [otpDialog, setOtpDialog] = useState<OtpDialogState>({
    open: false,
    type: "approve",
    isRequestingOtp: false,
  });

  /**
   * Generic function to start OTP flow for approve or reject
   * Fixes the code duplication issue between handleApprove and handleReject
   */
  const startOtpFlow = useCallback(
    (type: OtpFlowType) => {
      // Show dialog in loading state
      setOtpDialog({
        open: true,
        type,
        isRequestingOtp: true,
      });

      const operationType =
        type === "approve"
          ? OperationTypeEnum.ApproveCartablePayment
          : OperationTypeEnum.RejectCartablePayment;

      actions.requestOtp.mutate(
        {
          objectId: orderId,
          operation: operationType,
        },
        {
          onSuccess: () => {
            // Success - show OTP form (keep type intact)
            setOtpDialog((prev) => ({
              ...prev,
              open: true,
              isRequestingOtp: false,
            }));

            toast({
              title: t("common.success"),
              description: t("paymentOrders.otpSentSuccess"),
              variant: "success",
            });
          },
          onError: (err) => {
            const errorMessage = getErrorMessage(err);
            toast({
              title: t("common.error"),
              description: errorMessage,
              variant: "error",
            });

            // Close dialog on error (keep type for potential retry)
            setOtpDialog((prev) => ({
              ...prev,
              open: false,
              isRequestingOtp: false,
            }));
          },
        }
      );
    },
    [orderId, actions.requestOtp, toast, t]
  );

  /**
   * Start approve flow
   */
  const startApproveFlow = useCallback(() => {
    startOtpFlow("approve");
  }, [startOtpFlow]);

  /**
   * Start reject flow
   */
  const startRejectFlow = useCallback(() => {
    startOtpFlow("reject");
  }, [startOtpFlow]);

  /**
   * Confirm OTP code and perform approve/reject action
   */
  const confirmOtp = useCallback(
    async (otp: string) => {
      const operationType =
        otpDialog.type === "approve"
          ? OperationTypeEnum.ApproveCartablePayment
          : OperationTypeEnum.RejectCartablePayment;

      try {
        await actions.approveWithOtp.mutateAsync({
          operationType,
          withdrawalOrderId: orderId,
          otpCode: otp,
        });

        toast({
          title: t("common.success"),
          description:
            otpDialog.type === "approve"
              ? t("paymentOrders.orderApprovedSuccess")
              : t("paymentOrders.orderRejectedSuccess"),
          variant: "success",
        });

        // Close dialog - reset to default state
        setOtpDialog({
          open: false,
          type: "approve",
          isRequestingOtp: false,
        });
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        toast({
          title: t("common.error"),
          description: errorMessage,
          variant: "error",
        });
        throw err; // Re-throw for OtpDialog to handle
      }
    },
    [otpDialog.type, orderId, actions.approveWithOtp, toast, t]
  );

  /**
   * Resend OTP code
   */
  const resendOtp = useCallback(async () => {
    const operationType =
      otpDialog.type === "approve"
        ? OperationTypeEnum.ApproveCartablePayment
        : OperationTypeEnum.RejectCartablePayment;

    try {
      await actions.requestOtp.mutateAsync({
        objectId: orderId,
        operation: operationType,
      });

      toast({
        title: t("common.success"),
        description: t("paymentOrders.otpResentSuccess"),
        variant: "success",
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "error",
      });
      throw err;
    }
  }, [otpDialog.type, orderId, actions.requestOtp, toast, t]);

  /**
   * Close OTP dialog
   */
  const closeDialog = useCallback(() => {
    setOtpDialog((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    otpDialog,
    startApproveFlow,
    startRejectFlow,
    confirmOtp,
    resendOtp,
    closeDialog,
  };
}
