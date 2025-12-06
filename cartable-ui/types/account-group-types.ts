/**
 * Account Group Types
 * تایپ‌های مربوط به گروه‌های حساب
 */

export interface AccountGroup {
  id: string;
  title: string;
  accountCount?: number;
  icon?: string;
  description?: string;
  color?: string;
  isEnable?: boolean;
  items?: AccountGroupItem[];
}

export interface AccountGroupItem {
  id: string;
  bankGatewayGroupId: string;
  bankGatewayId: string;
  accountTitle: string;
  shebaNumber: string;
  accountNumber: string;
}

export interface AccountGroupDetail extends AccountGroup {
  items: AccountGroupItem[];
}

export interface CreateAccountGroupParams {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  isEnable: boolean;
}

export interface EditAccountGroupParams extends CreateAccountGroupParams {
  id: string;
}

export interface FilterAccountGroupsParams {
  pageNumber: number;
  pageSize: number;
  orderBy?: string;
  title?: string;
  isEnable?: boolean;
}

export interface FilterAccountGroupsResponse {
  items: AccountGroupDetail[];
  pageNumber: number;
  pageSize: number;
  totalPageCount: number;
  totalItemCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstItemOnPage: number;
  lastItemOnPage: number;
}

export interface ChangeAccountGroupStatusParams {
  bankGatewayGroupId: string;
  status: boolean;
}

export interface AddGroupAccountsParams {
  groupId: string;
  bankGatewayIds: string[];
}

// آیکون‌های مجاز
export const ALLOWED_ICONS = [
  "Crown",
  "Folders",
  "Tags",
  "Gem",
  "Layers",
  "Briefcase",
  "Wallet",
  "Handshake",
  "Coins",
  "Bookmark",
  "Banknote",
  "Award",
  "Star",
  "Bolt",
  "Archive",
  "Inbox",
  "Landmark",
  "Album",
  "File",
  "Building2",
] as const;

export type AllowedIcon = (typeof ALLOWED_ICONS)[number];

// رنگ‌های مجاز
export const ALLOWED_COLORS = [
  "#360185",
  "#DE1A58",
  "#F29AAE",
  "#3291B6",
  "#1581BF",
  "#FF6D1F",
  "#FF5555",
  "#A3D78A",
  "#0046FF",
  "#84994F",
  "#F25912",
  "#D78FEE",
  "#640D5F",
  "#78C841",
  "#E91E63",
  "#9C27B0",
  "#2196F3",
  "#00BCD4",
  "#4CAF50",
  "#FFC107",
] as const;

export type AllowedColor = (typeof ALLOWED_COLORS)[number];
