/**
 * Signer Types
 * انواع مربوط به امضاکنندگان و تأییدکنندگان
 */

export interface Signer {
  id: string;
  userId: string;
  userName: string;
  fullName: string;
  status: SignerStatus;
  createdDateTime?: string;
  bankGatewayId: string;
}

export interface OrderApprover {
  id: string;
  signerId: string;
  approverName: string;
  status: OrderApproveStatus;
  createdDateTime?: string;
  orderId: string;
}

export enum SignerStatus {
  EnableRequested = "enableRequested",
  Enable = "enable",
  Disable = "disable",
  DisableRequested = "disableRequested",
  Rejected = "rejected",
}

export enum OrderApproveStatus {
  WaitForAction = "waitForAction",
  Accepted = "accepted",
  Rejected = "rejected",
}
