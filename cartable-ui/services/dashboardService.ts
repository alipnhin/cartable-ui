import apiClient from "@/lib/api-client";
import type {
  TransactionProgressResponse,
  DashboardFilterParams,
} from "@/types/dashboard";

export const getTransactionProgress = async (
  params: DashboardFilterParams,
  accessToken: string
): Promise<TransactionProgressResponse> => {
  const response = await apiClient.post<TransactionProgressResponse>(
    "/v1-Cartable/Withdrawal/transaction-progress",
    {
      bankGatewayId: params.bankGatewayId || null,
      fromDate: params.fromDate,
      toDate: params.toDate,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
