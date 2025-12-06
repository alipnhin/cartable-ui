/**
 * User Profile Service
 * سرویس مدیریت پروفایل کاربر از Identity Server
 */

// ==================== Types ====================

export interface UserInfoResponse {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_number_verified?: boolean;
  picture?: string;
  role?: string | string[];
  NationalCode?: string;
  [key: string]: unknown;
}

// ==================== API Functions ====================

/**
 * دریافت اطلاعات کاربر از Identity Server UserInfo endpoint
 * @param accessToken - Access token from session
 * @returns User information from OIDC provider
 */
export const getUserInfo = async (
  accessToken: string
): Promise<UserInfoResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_ISSUER}/connect/userinfo`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // همیشه اطلاعات جدید دریافت شود
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch user info: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};
