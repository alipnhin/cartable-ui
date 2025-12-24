/**
 * React Query mutations for Payment Order Actions
 * مدیریت اکشن‌های دستور پرداخت با React Query
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  inquiryOrderById,
  inquiryTransactionById,
  sendToBank,
} from "@/services/paymentOrdersService";
import {
  sendOperationOtp,
  approvePayment,
} from "@/services/cartableService";
import { queryKeys } from "@/lib/react-query";
import type { OperationTypeEnum } from "@/types/api";

/**
 * پارامترهای تایید/رد دستور پرداخت
 */
export interface ApprovePaymentParams {
  operationType: OperationTypeEnum;
  withdrawalOrderId: string;
  otpCode: string;
}

/**
 * پارامترهای درخواست OTP
 */
export interface SendOtpParams {
  objectId: string;
  operation: OperationTypeEnum;
}

/**
 * Hook برای مدیریت اکشن‌های دستور پرداخت
 *
 * ویژگی‌ها:
 * - Mutations برای استعلام، ارسال به بانک، تایید، رد
 * - Auto invalidation بعد از success
 * - Type safety کامل
 * - Error handling یکپارچه
 *
 * @param orderId - شناسه دستور پرداخت
 * @returns Mutation functions
 *
 * @example
 * ```tsx
 * const actions = usePaymentOrderActions(orderId);
 *
 * // استعلام دستور پرداخت
 * actions.inquiry.mutate(undefined, {
 *   onSuccess: () => toast.success("استعلام موفق"),
 *   onError: (error) => toast.error(error.message),
 * });
 *
 * // ارسال به بانک
 * actions.sendToBank.mutate(undefined, {
 *   onSuccess: (message) => toast.success(message),
 * });
 *
 * // درخواست OTP
 * actions.requestOtp.mutate({ objectId, operation }, {
 *   onSuccess: () => toast.success("کد OTP ارسال شد"),
 * });
 *
 * // تایید با OTP
 * actions.approveWithOtp.mutate({ operationType, withdrawalOrderId, otpCode }, {
 *   onSuccess: () => toast.success("تایید موفق"),
 * });
 * ```
 */
export function usePaymentOrderActions(orderId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  /**
   * استعلام دستور پرداخت
   * بعد از موفقیت، cache جزئیات و تراکنش‌ها را invalidate می‌کند
   */
  const inquiry = useMutation({
    mutationFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await inquiryOrderById(orderId);
    },
    onSuccess: () => {
      // Invalidate جزئیات دستور و تراکنش‌ها
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentOrders.detail(orderId),
      });
    },
  });

  /**
   * استعلام یک تراکنش
   * بعد از موفقیت، فقط لیست تراکنش‌ها را invalidate می‌کند
   */
  const inquiryTransaction = useMutation({
    mutationFn: async (transactionId: string) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await inquiryTransactionById(transactionId);
    },
    onSuccess: () => {
      // Invalidate فقط لیست تراکنش‌ها (نه کل جزئیات)
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.paymentOrders.detail(orderId),
          "transactions",
        ],
      });
    },
  });

  /**
   * ارسال دستور پرداخت به بانک
   * بعد از موفقیت، کل cache دستور پرداخت را invalidate می‌کند
   */
  const sendToBankMutation = useMutation({
    mutationFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await sendToBank(orderId);
    },
    onSuccess: () => {
      // Invalidate کل جزئیات (چون وضعیت تغییر می‌کند)
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentOrders.detail(orderId),
      });
    },
  });

  /**
   * درخواست ارسال کد OTP
   * برای تایید یا رد دستور پرداخت
   */
  const requestOtp = useMutation({
    mutationFn: async (params: SendOtpParams) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await sendOperationOtp(params);
    },
  });

  /**
   * تایید یا رد دستور پرداخت با کد OTP
   * بعد از موفقیت، کل cache را invalidate می‌کند
   */
  const approveWithOtp = useMutation({
    mutationFn: async (params: ApprovePaymentParams) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await approvePayment(params);
    },
    onSuccess: () => {
      // Invalidate کل جزئیات (چون وضعیت تغییر می‌کند)
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentOrders.detail(orderId),
      });
      // همچنین لیست دستورات پرداخت را هم invalidate کنید
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentOrders.all,
      });
    },
  });

  return {
    inquiry,
    inquiryTransaction,
    sendToBank: sendToBankMutation,
    requestOtp,
    approveWithOtp,
  };
}
