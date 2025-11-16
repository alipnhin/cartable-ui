import apiClient from "@/lib/api-client";
import {
  CartableListResponse,
  CartableFilterParams,
} from "@/types/api";

/**
 * سرویس کارتابل
 * شامل توابع مربوط به واکشی و مدیریت دستورات پرداخت در کارتابل
 */

/**
 * واکشی لیست درخواست‌های در انتظار تائید امضادار
 * @param params پارامترهای فیلتر و صفحه‌بندی
 * @param accessToken توکن دسترسی کاربر
 * @returns لیست دستورات پرداخت به صورت صفحه‌بندی شده
 */
export const getApproverCartable = async (
  params: CartableFilterParams,
  accessToken: string
): Promise<CartableListResponse> => {
  const {
    pageNumber = 1,
    pageSize = 10,
    orderBy = "createdDateTime",
    bankGatewayId,
  } = params;

  // ساخت query parameters
  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
    orderBy,
  });

  // اگر bankGatewayId وجود داشت، اضافه کن
  if (bankGatewayId) {
    queryParams.append("bankGatewayId", bankGatewayId);
  }

  const response = await apiClient.post<CartableListResponse>(
    `/v1-Cartable/Approver/ApproverCartable?${queryParams.toString()}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
