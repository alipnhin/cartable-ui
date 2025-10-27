/**
 * Auth Service (Mock)
 * سرویس احراز هویت - نمونه و بدون API واقعی
 */
import { User, ApiResponse } from "@/types";
import { getUserByUsername, CURRENT_USER } from "@/mocks";


// تاخیر شبیه‌سازی شده
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// کد OTP معتبر (برای تست)
const VALID_OTP_CODE = "123456";

// Session Storage Keys
const SESSION_KEYS = {
  USER: "current_user",
  AUTH_TOKEN: "auth_token",
  OTP_PENDING: "otp_pending",
};

/**
 * ورود به سیستم (مرحله 1)
 */
export const login = async (
  username: string,
  password: string,
  captcha: string
): Promise<
  ApiResponse<{
    requireOTP: boolean;
    message: string;
  }>
> => {
  // تاخیر شبیه‌سازی (1.5 ثانیه)
  await delay(1500);

  // اعتبارسنجی ساده
  if (!username || username.length < 3) {
    return {
      success: false,
      message: "نام کاربری باید حداقل 3 کاراکتر باشد",
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: "رمز عبور باید حداقل 6 کاراکتر باشد",
    };
  }

  if (!captcha) {
    return {
      success: false,
      message: "لطفاً کد امنیتی را وارد کنید",
    };
  }

  // یافتن کاربر
  const user = getUserByUsername(username);
  if (!user) {
    return {
      success: false,
      message: "نام کاربری یا رمز عبور اشتباه است",
    };
  }

  // بررسی فعال بودن کاربر
  if (!user.isActive) {
    return {
      success: false,
      message: "حساب کاربری شما غیرفعال است",
    };
  }

  // ذخیره موقت برای مرحله OTP
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEYS.OTP_PENDING, JSON.stringify(user));
  }

  return {
    success: true,
    data: {
      requireOTP: true,
      message: "کد تأیید به شماره موبایل شما ارسال شد",
    },
    message: "ورود موفقیت‌آمیز بود",
  };
};

/**
 * تأیید کد OTP (مرحله 2)
 */
export const verifyOTP = async (
  otpCode: string
): Promise<ApiResponse<{ user: User; token: string }>> => {
  // تاخیر شبیه‌سازی (1 ثانیه)
  await delay(1000);

  // اعتبارسنجی کد OTP
  if (!otpCode || otpCode.length !== 6) {
    return {
      success: false,
      message: "کد تأیید باید 6 رقم باشد",
    };
  }

  // بررسی کد معتبر
  if (otpCode !== VALID_OTP_CODE) {
    return {
      success: false,
      message: "کد تأیید نامعتبر است",
    };
  }

  // گرفتن کاربر از session
  let user: User;
  if (typeof window !== "undefined") {
    const pendingUser = sessionStorage.getItem(SESSION_KEYS.OTP_PENDING);
    if (pendingUser) {
      user = JSON.parse(pendingUser);
      sessionStorage.removeItem(SESSION_KEYS.OTP_PENDING);
    } else {
      // اگر session نداشتیم، از کاربر پیش‌فرض استفاده کن
      user = CURRENT_USER;
    }
  } else {
    user = CURRENT_USER;
  }

  // تولید توکن ساختگی
  const token = `mock_token_${user.id}_${Date.now()}`;

  // ذخیره در session
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
    sessionStorage.setItem(SESSION_KEYS.AUTH_TOKEN, token);
  }

  return {
    success: true,
    data: {
      user: user,
      token: token,
    },
    message: "ورود موفق",
  };
};

/**
 * ارسال مجدد کد OTP
 */
export const resendOTP = async (): Promise<ApiResponse<{ message: string }>> => {
  // تاخیر شبیه‌سازی (1 ثانیه)
  await delay(1000);

  return {
    success: true,
    data: {
      message: "کد تأیید مجدداً ارسال شد",
    },
    message: "کد تأیید مجدداً ارسال شد",
  };
};

/**
 * خروج از سیستم
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  // تاخیر شبیه‌سازی (500ms)
  await delay(500);

  // پاک کردن session
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEYS.USER);
    sessionStorage.removeItem(SESSION_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(SESSION_KEYS.OTP_PENDING);
  }

  return {
    success: true,
    message: "خروج موفق",
  };
};

/**
 * گرفتن کاربر فعلی
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userStr = sessionStorage.getItem(SESSION_KEYS.USER);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * بررسی ورود کاربر
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem(SESSION_KEYS.AUTH_TOKEN);
};

/**
 * گرفتن توکن
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEYS.AUTH_TOKEN);
};
