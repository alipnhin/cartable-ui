import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { OperationTypeEnum } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import useTranslation from "@/hooks/useTranslation";
import { getErrorMessage } from "@/lib/error-handler";
import { queryKeys } from "@/lib/react-query";

type OtpFlowType = "approve" | "reject";

interface OtpDialogState {
  open: boolean;
  type: OtpFlowType;
  orderIds: string[];
  isRequestingOtp: boolean;
  isBatchOperation: boolean;
}

/**
 * پارامترهای درخواست OTP تکی
 */
interface SendSingleOtpParams {
  objectId: string;
  operation: OperationTypeEnum;
}

/**
 * پارامترهای درخواست OTP گروهی
 */
interface SendBatchOtpParams {
  objectIds: string[];
  operation: OperationTypeEnum;
}

/**
 * پارامترهای تایید تکی با OTP
 */
interface ApproveSingleWithOtpParams {
  operationType: OperationTypeEnum;
  withdrawalOrderId: string;
  otpCode: string;
}

/**
 * پارامترهای تایید گروهی با OTP
 */
interface ApproveBatchWithOtpParams {
  objectIds: string[];
  operationType: OperationTypeEnum;
  otpCode: string;
}

/**
 * توابع سرویس که باید از بیرون ارسال شوند
 */
interface CartableOtpServices {
  sendSingleOtp: (
    params: SendSingleOtpParams,
    token: string
  ) => Promise<string>;
  sendBatchOtp: (params: SendBatchOtpParams, token: string) => Promise<string>;
  approveSingleWithOtp: (
    params: ApproveSingleWithOtpParams,
    token: string
  ) => Promise<string>;
  approveBatchWithOtp: (
    params: ApproveBatchWithOtpParams,
    token: string
  ) => Promise<string>;
}

interface UseCartableOtpFlowParams {
  services: CartableOtpServices;
  onSuccess?: () => void | Promise<void>;
}

interface UseCartableOtpFlowReturn {
  // State
  otpDialog: OtpDialogState;

  // Single operations
  startSingleApprove: (orderId: string) => Promise<void>;
  startSingleReject: (orderId: string) => Promise<void>;

  // Batch operations
  startBatchApprove: (orderIds: string[]) => Promise<void>;
  startBatchReject: (orderIds: string[]) => Promise<void>;

  // OTP actions
  confirmOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  closeDialog: () => void;
}

/**
 * Generic hook for managing OTP flow in Cartable pages (my-cartable & manager-cartable)
 *
 * این hook تمام logic مربوط به OTP را encapsulate می‌کند:
 * - عملیات تکی (single approve/reject)
 * - عملیات گروهی (batch approve/reject)
 * - مدیریت state دیالوگ OTP
 * - ارسال مجدد OTP
 *
 * Features:
 * - Generic - برای هر دو my-cartable و manager-cartable قابل استفاده
 * - رفع تکرار کد - جایگزین 4 تابع تکراری
 * - Type-safe - با استفاده از TypeScript
 * - State management ساده و صحیح
 *
 * @param params شامل توابع سرویس و callback موفقیت
 * @returns OTP flow state and handlers
 *
 * @example
 * ```tsx
 * // My Cartable
 * const otpFlow = useCartableOtpFlow({
 *   services: {
 *     sendSingleOtp: sendOperationOtp,
 *     sendBatchOtp: sendBatchOperationOtp,
 *     approveSingleWithOtp: approvePayment,
 *     approveBatchWithOtp: batchApprovePayments,
 *   },
 *   onSuccess: reloadData,
 * });
 *
 * // Manager Cartable
 * const otpFlow = useCartableOtpFlow({
 *   services: {
 *     sendSingleOtp: sendManagerOperationOtp,
 *     sendBatchOtp: sendManagerBatchOperationOtp,
 *     approveSingleWithOtp: managerApprovePayment,
 *     approveBatchWithOtp: managerBatchApprovePayments,
 *   },
 *   onSuccess: reloadData,
 * });
 * ```
 */
export function useCartableOtpFlow({
  services,
  onSuccess,
}: UseCartableOtpFlowParams): UseCartableOtpFlowReturn {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [otpDialog, setOtpDialog] = useState<OtpDialogState>({
    open: false,
    type: "approve",
    orderIds: [],
    isRequestingOtp: false,
    isBatchOperation: false,
  });

  /**
   * Generic function to start OTP flow
   * این تابع تمام تکرارها را حذف می‌کند
   */
  const startOtpFlow = useCallback(
    async (
      type: OtpFlowType,
      orderIds: string[],
      isBatchOperation: boolean
    ) => {
      if (!session?.accessToken || orderIds.length === 0) return;

      // نمایش دیالوگ در حالت loading
      setOtpDialog({
        open: true,
        type,
        orderIds,
        isRequestingOtp: true,
        isBatchOperation,
      });

      try {
        const operationType =
          type === "approve"
            ? OperationTypeEnum.ApproveCartablePayment
            : OperationTypeEnum.RejectCartablePayment;

        // ارسال درخواست OTP بر اساس نوع عملیات
        if (isBatchOperation) {
          await services.sendBatchOtp(
            {
              objectIds: orderIds,
              operation: operationType,
            },
            session.accessToken
          );
        } else {
          await services.sendSingleOtp(
            {
              objectId: orderIds[0],
              operation: operationType,
            },
            session.accessToken
          );
        }

        // موفقیت - نمایش فرم OTP (حفظ type و سایر state ها)
        setOtpDialog((prev) => ({
          ...prev,
          isRequestingOtp: false,
        }));

        toast({
          title: t("toast.success"),
          description: t("otp.codeSent"),
          variant: "success",
        });
      } catch (error) {
        // بستن دیالوگ در صورت خطا (حفظ type برای retry احتمالی)
        setOtpDialog((prev) => ({
          ...prev,
          open: false,
          isRequestingOtp: false,
        }));

        toast({
          title: t("toast.error"),
          description: getErrorMessage(error),
          variant: "error",
        });
      }
    },
    [session?.accessToken, services, toast, t]
  );

  /**
   * Start single approve flow
   */
  const startSingleApprove = useCallback(
    async (orderId: string) => {
      await startOtpFlow("approve", [orderId], false);
    },
    [startOtpFlow]
  );

  /**
   * Start single reject flow
   */
  const startSingleReject = useCallback(
    async (orderId: string) => {
      await startOtpFlow("reject", [orderId], false);
    },
    [startOtpFlow]
  );

  /**
   * Start batch approve flow
   */
  const startBatchApprove = useCallback(
    async (orderIds: string[]) => {
      await startOtpFlow("approve", orderIds, true);
    },
    [startOtpFlow]
  );

  /**
   * Start batch reject flow
   */
  const startBatchReject = useCallback(
    async (orderIds: string[]) => {
      await startOtpFlow("reject", orderIds, true);
    },
    [startOtpFlow]
  );

  /**
   * Confirm OTP code and perform action
   */
  const confirmOtp = useCallback(
    async (otp: string) => {
      if (!session?.accessToken) return;

      try {
        const operationType =
          otpDialog.type === "approve"
            ? OperationTypeEnum.ApproveCartablePayment
            : OperationTypeEnum.RejectCartablePayment;

        // تشخیص عملیات تکی یا گروهی بر اساس فلگ
        if (otpDialog.isBatchOperation) {
          await services.approveBatchWithOtp(
            {
              objectIds: otpDialog.orderIds,
              operationType,
              otpCode: otp,
            },
            session.accessToken
          );
        } else {
          await services.approveSingleWithOtp(
            {
              operationType,
              withdrawalOrderId: otpDialog.orderIds[0]!,
              otpCode: otp,
            },
            session.accessToken
          );
        }

        const action = otpDialog.type === "approve" ? "تأیید" : "رد";
        const count = otpDialog.orderIds.length;

        toast({
          title: t("toast.success"),
          description: `${count} دستور با موفقیت ${action} شد`,
          variant: "success",
        });

        // بستن دیالوگ - reset to default
        setOtpDialog({
          open: false,
          type: "approve",
          orderIds: [],
          isRequestingOtp: false,
          isBatchOperation: false,
        });

        // Invalidate dashboard چون transaction status تغییر می‌کند
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.all,
        });

        // Invalidate payment orders list
        queryClient.invalidateQueries({
          queryKey: queryKeys.paymentOrders.all,
        });

        // فراخوانی callback موفقیت
        if (onSuccess) {
          await onSuccess();
        }
      } catch (error) {
        toast({
          title: t("toast.error"),
          description: getErrorMessage(error),
          variant: "error",
        });
        throw error; // برای نمایش خطا در OtpDialog
      }
    },
    [otpDialog, session?.accessToken, services, toast, t, onSuccess]
  );

  /**
   * Resend OTP code
   */
  const resendOtp = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      const operationType =
        otpDialog.type === "approve"
          ? OperationTypeEnum.ApproveCartablePayment
          : OperationTypeEnum.RejectCartablePayment;

      // ارسال مجدد بر اساس نوع عملیات
      if (otpDialog.isBatchOperation) {
        await services.sendBatchOtp(
          {
            objectIds: otpDialog.orderIds,
            operation: operationType,
          },
          session.accessToken
        );
      } else {
        await services.sendSingleOtp(
          {
            objectId: otpDialog.orderIds[0]!,
            operation: operationType,
          },
          session.accessToken
        );
      }

      toast({
        title: t("toast.info"),
        description: t("otp.codeSent"),
        variant: "info",
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: getErrorMessage(error),
        variant: "error",
      });
      throw error;
    }
  }, [otpDialog, session?.accessToken, services, toast, t]);

  /**
   * Close OTP dialog
   */
  const closeDialog = useCallback(() => {
    setOtpDialog((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    otpDialog,
    startSingleApprove,
    startSingleReject,
    startBatchApprove,
    startBatchReject,
    confirmOtp,
    resendOtp,
    closeDialog,
  };
}
