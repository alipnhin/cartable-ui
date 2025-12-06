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

export const ALLOWED_COLORS = [
  "#FF6B6B",
  "#E63946",
  "#F3722C",
  "#FF9F1C",
  "#FFBE0B",
  "#FEE440",
  "#D9ED92",
  "#B5E48C",
  "#99D98C",
  "#76C893",
  "#52B69A",
  "#34A0A4",
  "#168AAD",
  "#1A759F",
  "#1E6091",
  "#184E77",
  "#6A4C93",
  "#8D5BBA",
  "#B185DB",
  "#D4BEEE",
] as const;

export type AllowedColor = (typeof ALLOWED_COLORS)[number];
