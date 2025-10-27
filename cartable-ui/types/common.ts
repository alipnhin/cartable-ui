/**
 * Common Types
 * انواع مشترک و پایه‌ای که در سراسر برنامه استفاده می‌شوند
 */

// Pagination
export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationRequest {
  pageNumber?: number;
  pageSize?: number;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
}

// Filter
export interface FilterValue {
  field: string;
  operator: FilterOperator;
  value: any;
}

export type FilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "between"
  | "in"
  | "notIn";

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

// Date Range
export interface DateRange {
  fromDate: string; // ISO format
  toDate: string; // ISO format
}

// Quick Date Range presets
export type QuickDateRange =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

// File Upload
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Change History Entry
export interface ChangeHistoryEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string; // created, approved, rejected, status_changed, etc.
  actionLabel_fa: string;
  actionLabel_en: string;
  description_fa: string;
  description_en: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  comment?: string;
}

export type ChangeAction =
  | "created"
  | "updated"
  | "deleted"
  | "approved"
  | "rejected"
  | "submitted"
  | "submitted_to_bank"
  | "processed"
  | "status_changed"
  | "comment_added";

// Notification
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export type NotificationType = "info" | "success" | "warning" | "error";

// Badge/Status Color
export type StatusColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
