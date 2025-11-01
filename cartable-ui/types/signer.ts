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
  phoneNumber?: string;
}

export enum SignerRole {
  Approver = "Approver", // امضای اول
  Manager = "Manager", // امضای دوم
 }

export interface Approver {
  id: string;
  userId: string;
  userName: string;
  fullName: string;
  status: ApproverStatus;
  createdDateTime?: string;
  comment?: string;
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
}
