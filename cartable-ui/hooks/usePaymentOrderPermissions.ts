import {
  PaymentStatusEnum,
  PaymentItemStatusEnum,
  WithdrawalStatistics,
} from "@/types/api";

interface UsePaymentOrderPermissionsParams {
  orderStatus?: PaymentStatusEnum;
  statistics?: WithdrawalStatistics;
}

interface UsePaymentOrderPermissionsReturn {
  canInquiry: boolean;
  canApproveReject: boolean;
  canSendToBank: boolean;
  waitForBankCount: number;
}

/**
 * Hook for calculating payment order permissions and statistics
 * Replaces unnecessary useMemo calls with simple boolean comparisons
 */
export function usePaymentOrderPermissions({
  orderStatus,
  statistics,
}: UsePaymentOrderPermissionsParams): UsePaymentOrderPermissionsReturn {
  // Simple boolean comparisons - no need for useMemo
  const canInquiry = orderStatus === PaymentStatusEnum.SubmittedToBank;
  const canApproveReject =
    orderStatus === PaymentStatusEnum.WaitingForOwnersApproval;
  const canSendToBank = orderStatus === PaymentStatusEnum.OwnersApproved;

  // Calculate pending transactions count (WaitForExecution + WaitForBank)
  // Using reduce instead of multiple find calls for better performance
  const waitForBankCount =
    statistics?.statusStatistics.breakdown.reduce(
      (count: number, item) => {
        if (
          item.status === PaymentItemStatusEnum.WaitForExecution ||
          item.status === PaymentItemStatusEnum.WaitForBank
        ) {
          return count + item.count;
        }
        return count;
      },
      0
    ) ?? 0;

  return {
    canInquiry,
    canApproveReject,
    canSendToBank,
    waitForBankCount,
  };
}
