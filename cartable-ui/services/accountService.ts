import apiClient from "@/lib/api-client";

export interface AccountSelectData {
  id: string;
  text: string;
  data: string;
  image: string;
}

export interface AccountSelectResponse {
  total: number;
  results: AccountSelectData[];
}

export interface AccountSelectParams {
  searchTerm?: string;
  pageSize?: number;
  pageNum?: number;
}

export const getAccountsSelectData = async (
  params: AccountSelectParams,
  accessToken: string
): Promise<AccountSelectResponse> => {
  const response = await apiClient.post<AccountSelectResponse>(
    "/v1-Cartable/ManageAccount/SelectData",
    {
      searchTerm: params.searchTerm || "",
      pageSize: params.pageSize || 50,
      pageNum: params.pageNum || 1,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
