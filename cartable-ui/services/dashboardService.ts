import apiClient from "@/lib/api-client";
import type {
  TransactionProgressResponse,
  DashboardFilterParams,
} from "@/types/dashboard";

export const getTransactionProgress = async (
  params: DashboardFilterParams
): Promise<TransactionProgressResponse> => {
  // اگر accountGroupId مقدار "all" داشته باشد، null ارسال می‌کنیم
  const accountGroupId =
    params.accountGroupId && params.accountGroupId !== "all"
      ? params.accountGroupId
      : null;

  const response = await apiClient.post<TransactionProgressResponse>(
    "/Dashboard/transaction-progress",
    {
      bankGatewayId: params.bankGatewayId || null,
      accountGroupId,
      fromDate: params.fromDate,
      toDate: params.toDate,
    }
  );

  return response.data;
};
