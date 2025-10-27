/**
 * Signer Types
 * انواع مربوط به امضاکنندگان و تأییدکنندگان
 */

export interface Signer {
  id: string;
  userId: string;
  userName: string;
  fullName: string;
  role: SignerRole;
  order: number; // ترتیب امضا
  isRequired: boolean; // آیا امضا الزامی است؟
  phoneNumber?: string;
  email?: string;
}

export enum SignerRole {
  FirstSigner = "first_signer", // امضای اول
  SecondSigner = "second_signer", // امضای دوم
  ThirdSigner = "third_signer", // امضای سوم
  AdditionalSigner = "additional_signer", // امضای اضافی
}

export interface Approver {
  id: string;
  userId: string;
  userName: string;
  fullName: string;
  status: ApproverStatus;
  approvedAt?: string;
  rejectedAt?: string;
  comment?: string;
  ipAddress?: string;
}

export enum ApproverStatus {
  Pending = "pending", // در انتظار تأیید
  Approved = "approved", // تأیید شده
  Rejected = "rejected", // رد شده
}

export interface SignatureProgress {
  required: number; // تعداد امضای مورد نیاز
  completed: number; // تعداد امضای انجام شده
  remaining: number; // تعداد امضای باقیمانده
  percentage: number; // درصد پیشرفت
  isComplete: boolean; // آیا تعداد امضا کامل شده؟
}

export interface ApprovalSummary {
  totalApprovers: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  canProceed: boolean; // آیا می‌توان ادامه داد؟
}
