import apiClient from "@/lib/api-client";

// ==================== Types ====================

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

// API Response Types
export interface AccountListItem {
  id: string;
  bankId: string;
  bankName: string;
  title: string;
  bankCode: string;
  shebaNumber: string;
  accountNumber: string;
  isEnable: boolean;
  hasCartable: boolean;
  hasCartableManager: boolean;
  createdDateTime: string;
}

export interface AccountUser {
  id: string;
  userId: string;
  bankGatewayId: string;
  status: number | string; // 0/EnableRequested, 1/Enable, 2/Disable, 3/DisableRequested, 4/Rejected
  fullName: string;
  createdDateTime: string;
  updatedDateTime: string;
  tenantId: string;
  tenantName: string;
  bankName: string;
  bankCode: string;
  bankGatewayTitle: string;
  accountNumber: string;
}

export interface AccountDetailResponse {
  id: string;
  bankId: string;
  bankName: string;
  title: string;
  bankCode: string;
  shebaNumber: string;
  accountNumber: string;
  isAccountNumberRequierd: boolean;
  batchSize: number;
  isEnable: boolean;
  hasCartable: boolean;
  minimumSignature: number;
  createdDateTime: string;
  users: AccountUser[];
}

export interface UserSelectItem {
  id: string;
  userName: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
}

export interface ChangeMinimumSignatureParams {
  minimumSignature: number;
  bankGatewayId: string;
}

export interface AddSignerParams {
  userId: string;
  bankGatewayId: string;
  fullName: string;
}

// ==================== API Functions ====================

/**
 * Get accounts select data for dropdowns
 */
export const getAccountsSelectData = async (
  params: AccountSelectParams,
  accountGroupId?: string
): Promise<AccountSelectResponse> => {
  let url = "/Accounts/AccountSelect";
  if (accountGroupId && accountGroupId !== "all") {
    const queryParams = new URLSearchParams({ accountGroupId });
    url = `${url}?${queryParams.toString()}`;
  }
  const response = await apiClient.post<AccountSelectResponse>(
    url,
    {
      searchTerm: params.searchTerm || "",
      pageSize: params.pageSize || 50,
      pageNum: params.pageNum || 1,
    }
  );

  return response.data;
};

/**
 * Get list of all accounts
 */
export const getAccountsList = async (
  accountGroupId?: string
): Promise<AccountListItem[]> => {
  // ساخت query parameters
  let url = "/Accounts";

  // اگر accountGroupId وجود داشت و "all" نبود، به query string اضافه کن
  if (accountGroupId && accountGroupId !== "all") {
    const queryParams = new URLSearchParams({ accountGroupId });
    url = `${url}?${queryParams.toString()}`;
  }

  const response = await apiClient.get<AccountListItem[]>(url);

  return response.data;
};

/**
 * Get account details by ID
 */
export const getAccountDetail = async (
  id: string
): Promise<AccountDetailResponse> => {
  const response = await apiClient.get<AccountDetailResponse>(
    `/Accounts/${id}`
  );

  return response.data;
};

/**
 * Change minimum signature count for an account
 */
export const changeMinimumSignature = async (
  params: ChangeMinimumSignatureParams
): Promise<string> => {
  const response = await apiClient.post<string>(
    "/Accounts/change-minimum-signature",
    params,
    {
      headers: {"Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data;
};

/**
 * Add a new signer to an account
 */
export const addSigner = async (
  params: AddSignerParams
): Promise<string> => {
  const response = await apiClient.post<string>(
    "/Accounts/add-signer",
    params,
    {
      headers: {"Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data;
};

/**
 * Get list of users for signer selection
 */
export const getUsersList = async (): Promise<UserSelectItem[]> => {
  const response = await apiClient.get<UserSelectItem[]>("/Accounts/users");

  return response.data;
};

/**
 * Disable a signer (request deactivation)
 */
export const disableSigner = async (
  signerId: string
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/Accounts/signers/${signerId}/disable`,
    {}
  );

  return response.data;
};

/**
 * Enable a signer (activate)
 */
export const enableSigner = async (
  signerId: string
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/Accounts/signers/${signerId}/enable`,
    {}
  );

  return response.data;
};
