"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error-handler";
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  UserCircle,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FixHeader } from "@/components/layout/Fix-Header";
import { useUserProfileQuery } from "@/hooks/useUserProfileQuery";
import { useRegisterRefresh } from "@/contexts/pull-to-refresh-context";
import { PageTitle } from "@/components/common/page-title";
import { ErrorState } from "@/components/common/error-state";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  // استفاده از React Query hook
  const {
    data: userInfo,
    isLoading,
    error: queryError,
    refetch,
    isRefetching,
  } = useUserProfileQuery();

  // ثبت refetch برای Pull-to-Refresh
  useRegisterRefresh(async () => {
    await refetch();
  });

  // Error state
  const error = queryError ? getErrorMessage(queryError) : null;

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <>
        <PageTitle title={t("profile.pageTitle")} />
        <FixHeader returnUrl="/dashboard" />
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
          <div className="container max-w-5xl mx-auto px-4 py-8 mt-14">
            <Skeleton className="h-64 w-full rounded-2xl mb-6" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && !userInfo) {
    return (
      <>
        <PageTitle title={t("profile.pageTitle")} />
        <FixHeader returnUrl="/dashboard" />
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
          <div className="container max-w-5xl mx-auto px-4 py-8 mt-14">
            <ErrorState
              title={t("profile.errorTitle")}
              message={error}
              onRetry={() => refetch()}
            />
          </div>
        </div>
      </>
    );
  }

  // استخراج اطلاعات کاربر
  const fullName =
    userInfo?.given_name && userInfo?.family_name
      ? `${userInfo.given_name} ${userInfo.family_name}`
      : userInfo?.name || "کاربر";
  const username = userInfo?.preferred_username || userInfo?.name || "-";
  const email = userInfo?.email || "-";
  const phoneNumber = userInfo?.phone_number || "-";
  const nationalCode = userInfo?.NationalCode || "-";
  const phoneVerified = userInfo?.phone_number_verified || false;
  const emailVerified = userInfo?.email_verified || false;

  // استخراج نقش‌ها
  const allRoles = Array.isArray(userInfo?.role)
    ? userInfo.role
    : userInfo?.role
    ? [userInfo.role]
    : [];

  // تابع تبدیل نقش به عنوان فارسی
  const getRoleName = (role: string): string => {
    if (role === "cartableadmin.role") return "مدیر کارتابل";
    if (role === "cartableapprover.role") return "امضادار";
    return role;
  };

  // فیلتر نقش‌های مهم فقط
  const importantRoles = allRoles.filter(
    (role) => role === "cartableadmin.role" || role === "cartableapprover.role"
  );

  const userImage = userInfo?.picture || "/media/avatars/blank.png";

  return (
    <>
      <FixHeader returnUrl="/dashboard" />
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
        <div className="container max-w-5xl mx-auto px-4 py-8 ">
          {/* Header Section */}
          <Card className="mb-6 hover:shadow-lg transition-all duration-300 animate-fade-in border-2 hover:border-primary/20 mt-14">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl transition-transform group-hover:scale-105">
                    <img
                      src={userImage}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/media/avatars/blank.png";
                      }}
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-start space-y-4 w-full">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-l from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {fullName}
                    </h1>
                    <p className="text-base text-muted-foreground mt-1">
                      @{username}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {importantRoles.map((role: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-2 px-4 py-2 text-sm font-medium rounded-full"
                      >
                        <Shield className="w-4 h-4" />
                        {getRoleName(role)}
                      </Badge>
                    ))}

                    {phoneVerified && (
                      <Badge
                        variant="success"
                        className="gap-2 px-4 py-2 text-sm rounded-full"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t("profile.phoneVerified")}
                      </Badge>
                    )}

                    {emailVerified && (
                      <Badge
                        variant="info"
                        className="gap-2 px-4 py-2 text-sm rounded-full"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t("profile.emailVerified")}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="gap-2 rounded-xl h-11 px-6 border-2 hover:border-primary/50 transition-all"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
                  />
                  {isRefetching ? t("common.loading") : t("common.refresh")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in border-2 hover:border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-primary" />
                {t("profile.personalInformation")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* نام کامل */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <UserCircle className="w-4 h-4" />
                    {t("common.labels.fullName")}
                  </Label>
                  <div className="flex h-12 items-center rounded-xl border-2 border-border/50 bg-background/50 px-4 font-medium transition-colors hover:border-primary/30">
                    {fullName}
                  </div>
                </div>

                {/* نام کاربری */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="w-4 h-4" />
                    {t("common.labels.username")}
                  </Label>
                  <div className="flex h-12 items-center rounded-xl border-2 border-border/50 bg-background/50 px-4 font-medium transition-colors hover:border-primary/30">
                    {username}
                  </div>
                </div>

                {/* ایمیل */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {t("common.labels.email")}
                    {emailVerified && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </Label>
                  <div className="flex h-12 items-center rounded-xl border-2 border-border/50 bg-background/50 px-4 font-medium transition-colors hover:border-primary/30 break-all">
                    {email}
                  </div>
                </div>

                {/* شماره تماس */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {t("common.labels.phone")}
                    {phoneVerified && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </Label>
                  <div
                    className="flex h-12 items-center rounded-xl border-2 border-border/50 bg-background/50 px-4 font-medium transition-colors hover:border-primary/30"
                    dir="ltr"
                  >
                    {phoneNumber}
                  </div>
                </div>

                {/* کد ملی */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    {t("common.labels.nationalCode")}
                  </Label>
                  <div
                    className="flex h-12 items-center rounded-xl border-2 border-border/50 bg-background/50 px-4 font-medium transition-colors hover:border-primary/30"
                    dir="ltr"
                  >
                    {nationalCode}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
