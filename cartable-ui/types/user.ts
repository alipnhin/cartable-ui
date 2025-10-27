/**
 * User Types
 * انواع مربوط به کاربران و احراز هویت
 */

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  nationalId?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export enum UserRole {
  SuperAdmin = "super_admin",
  Admin = "admin",
  Manager = "manager",
  Accountant = "accountant",
  Viewer = "viewer",
}

export interface UserProfile extends User {
  department?: string;
  position?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
}

// Authentication
export interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
}

export interface LoginResponse {
  success: boolean;
  requireOTP: boolean;
  otpSentTo?: string; // masked phone number
  sessionId?: string;
  message?: string;
}

export interface OTPVerificationRequest {
  sessionId: string;
  otpCode: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  token: string;
  user: User;
  expiresAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
}

// OTP
export interface OTPConfig {
  length: number;
  validitySeconds: number;
  resendCooldownSeconds: number;
}

export const DEFAULT_OTP_CONFIG: OTPConfig = {
  length: 6,
  validitySeconds: 120,
  resendCooldownSeconds: 120,
};
