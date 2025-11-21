import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session type to include custom fields
   * توسعه نوع Session برای شامل کردن فیلدهای سفارشی
   */
  interface Session {
    /** Access token from OIDC provider */
    accessToken?: string;
    /** Error message if token refresh failed */
    error?: string;
    /** User information */
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in user type
   * توسعه نوع User
   */
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT type
   * توسعه نوع JWT
   */
  interface JWT {
    /** Access token from OIDC provider */
    accessToken?: string;
    /** Refresh token for getting new access token */
    refreshToken?: string;
    /** Token expiration timestamp (seconds since epoch) */
    expiresAt?: number;
    /** ID token from OIDC provider */
    idToken?: string;
    /** Error message if token refresh failed */
    error?: string;
  }
}

/**
 * JWT Token Payload Structure
 * ساختار payload توکن JWT
 */
export interface JWTTokenPayload {
  /** Subject (user ID) */
  sub: string;
  /** Token expiration time */
  exp: number;
  /** Issued at time */
  iat: number;
  /** Issuer */
  iss?: string;
  /** Audience */
  aud?: string | string[];
  /** User roles - can be in different formats */
  role?: string | string[];
  roles?: string | string[];
  /** Microsoft role claim format */
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  /** Other custom claims */
  [key: string]: unknown;
}

/**
 * OIDC Token Response
 * پاسخ توکن از Identity Server
 */
export interface OIDCTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
  scope?: string;
}

/**
 * OIDC Profile
 * پروفایل کاربر از OIDC Provider
 */
export interface OIDCProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
  [key: string]: unknown;
}
