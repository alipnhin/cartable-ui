/**
 * 404 Not Found Page
 * صفحه یافت نشد (404)
 *
 * این صفحه زمانی نمایش داده می‌شود که:
 * - مسیر درخواستی وجود ندارد
 * - صفحه مورد نظر پیدا نشد
 *
 * @module app/not-found
 */

import { auth } from "@/auth";
import { extractRolesFromToken } from "@/lib/jwt-utils";
import { UserRole } from "@/config/permissions";
import NotFoundClient from "./not-found-client";

export default async function NotFoundPage() {
  // Get user session and roles
  const session = await auth();
  const userRoles = session?.accessToken
    ? extractRolesFromToken(session.accessToken)
    : [];

  // بررسی اینکه آیا کاربر نقش امضادار دارد
  const isApprover = userRoles.includes(UserRole.CARTABLE_APPROVER);

  return <NotFoundClient isApprover={isApprover} />;
}
