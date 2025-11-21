/**
 * JWT Utilities
 * ابزارهای کمکی برای کار با JWT
 *
 * این ماژول از کتابخانه jose برای parse و verify کردن JWT استفاده می‌کند
 * @module lib/jwt-utils
 */

import { decodeJwt } from 'jose';
import type { JWTTokenPayload } from '@/types/next-auth';

/**
 * Safely decode JWT token without verification
 * رمزگشایی ایمن توکن JWT بدون اعتبارسنجی
 *
 * ⚠️ Warning: این تابع token را verify نمی‌کند - فقط decode می‌کند
 * برای استفاده‌های داخلی و در middleware که توکن از next-auth می‌آید
 *
 * @param token - JWT token
 * @returns Decoded payload or null if invalid
 *
 * @example
 * ```ts
 * const payload = decodeJwtToken(session.accessToken);
 * if (payload) {
 *   console.log(payload.sub); // user ID
 * }
 * ```
 */
export function decodeJwtToken(token: string): JWTTokenPayload | null {
  try {
    // Use jose's decodeJwt which handles malformed tokens safely
    const payload = decodeJwt(token);

    // Validate required fields
    if (!payload.sub) {
      console.error('JWT token missing required "sub" claim');
      return null;
    }

    return payload as JWTTokenPayload;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Extract user roles from JWT token
 * استخراج نقش‌های کاربر از توکن JWT
 *
 * @param token - JWT token string
 * @returns Array of user roles
 *
 * @example
 * ```ts
 * const roles = extractRolesFromToken(session.accessToken);
 * console.log(roles); // ['cartable-approver', 'admin']
 * ```
 */
export function extractRolesFromToken(token: string | undefined): string[] {
  if (!token) {
    return [];
  }

  const payload = decodeJwtToken(token);
  if (!payload) {
    return [];
  }

  // Roles can be in different claim types depending on Identity Server config
  const roles =
    payload.role ||
    payload.roles ||
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    [];

  // Ensure roles is always an array
  return Array.isArray(roles) ? roles : [roles];
}

/**
 * Check if JWT token is expired
 * بررسی اینکه آیا توکن JWT منقضی شده است
 *
 * @param token - JWT token string
 * @param bufferSeconds - Buffer time in seconds before actual expiration (default: 60)
 * @returns true if token is expired or will expire within buffer time
 *
 * @example
 * ```ts
 * if (isTokenExpired(token, 300)) {
 *   // Token will expire in less than 5 minutes
 *   await refreshToken();
 * }
 * ```
 */
export function isTokenExpired(
  token: string | undefined,
  bufferSeconds: number = 60
): boolean {
  if (!token) {
    return true;
  }

  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const bufferTime = bufferSeconds * 1000;

  return currentTime >= expirationTime - bufferTime;
}

/**
 * Get token expiration time
 * دریافت زمان انقضای توکن
 *
 * @param token - JWT token string
 * @returns Expiration date or null if invalid
 */
export function getTokenExpiration(token: string | undefined): Date | null {
  if (!token) {
    return null;
  }

  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

/**
 * Get user ID from JWT token
 * دریافت شناسه کاربر از توکن JWT
 *
 * @param token - JWT token string
 * @returns User ID (sub claim) or null
 */
export function getUserIdFromToken(token: string | undefined): string | null {
  if (!token) {
    return null;
  }

  const payload = decodeJwtToken(token);
  return payload?.sub ?? null;
}
