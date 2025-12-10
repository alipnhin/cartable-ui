# API Endpoint Mapping - تدبیرپی به BFF

این فایل نقشه‌ی تبدیل endpoint‌های تدبیرپی به BFF را نشان می‌دهد.

## Payment Orders (دستورات پرداخت)

### جستجوی دستورات پرداخت
**قبل (تدبیرپی مستقیم):**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Withdrawal/Search
```

**بعد (از طریق BFF):**
```
POST http://localhost:5000/api/PaymentOrders/search
```

### دریافت جزئیات دستور پرداخت
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Withdrawal/{id}/find
```

**بعد:**
```
GET http://localhost:5000/api/PaymentOrders/{id}
```

### دریافت آمار دستور پرداخت
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Withdrawal/{id}/statistics/complete
```

**بعد:**
```
GET http://localhost:5000/api/PaymentOrders/{id}/statistics
```

### استعلام دستور پرداخت
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Withdrawal/InquiryById/{orderId}
```

**بعد:**
```
GET http://localhost:5000/api/PaymentOrders/{id}/inquiry
```

### ارسال به بانک
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Withdrawal/SendToBank/{orderId}
```

**بعد:**
```
POST http://localhost:5000/api/PaymentOrders/{id}/send-to-bank
```

---

## Accounts (حساب‌ها)

### لیست حساب‌ها
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/GetList
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/GetList?accountGroupId={id}
```

**بعد:**
```
GET http://localhost:5000/api/Accounts
GET http://localhost:5000/api/Accounts?accountGroupId={id}
```

### جزئیات حساب
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/{id}/find
```

**بعد:**
```
GET http://localhost:5000/api/Accounts/{id}
```

### تغییر حداقل امضا
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/ChangeMinimumSignature
```

**بعد:**
```
POST http://localhost:5000/api/Accounts/change-minimum-signature
```

### اضافه کردن امضادار
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount
```

**بعد:**
```
POST http://localhost:5000/api/Accounts/add-signer
```

### لیست کاربران
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/GetUsers
```

**بعد:**
```
GET http://localhost:5000/api/Accounts/users
```

### غیرفعال کردن امضادار
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/DisableApproverStatus/{signerId}
```

**بعد:**
```
POST http://localhost:5000/api/Accounts/signers/{signerId}/disable
```

### فعال کردن امضادار
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/EnableApproverStatus/{signerId}
```

**بعد:**
```
POST http://localhost:5000/api/Accounts/signers/{signerId}/enable
```

---

## Cartable (کارتابل امضادار)

### دریافت لیست کارتابل
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Approver/ApproverCartable
```

**بعد:**
```
POST http://localhost:5000/api/Cartable/approver-cartable
```

### ارسال OTP
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Approver/SendOperationOtp
```

**بعد:**
```
POST http://localhost:5000/api/Cartable/send-otp
```

### تایید/رد
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Approver/Approve
```

**بعد:**
```
POST http://localhost:5000/api/Cartable/approve
```

### ارسال OTP گروهی
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Approver/SendBatchOperationOtp
```

**بعد:**
```
POST http://localhost:5000/api/Cartable/send-batch-otp
```

### تایید/رد گروهی
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Approver/BatchApprove
```

**بعد:**
```
POST http://localhost:5000/api/Cartable/batch-approve
```

---

## Account Groups (گروه‌های حساب)

### لیست گروه‌های حساب
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/GetAccountGroups
```

**بعد:**
```
GET http://localhost:5000/api/AccountGroups
```

### جستجو و فیلتر گروه‌های حساب
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/FilterAccountGroups
```

**بعد:**
```
POST http://localhost:5000/api/AccountGroups/filter
```

### دریافت جزئیات گروه حساب
**قبل:**
```
GET https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/GetAccountGroupById/{id}
```

**بعد:**
```
GET http://localhost:5000/api/AccountGroups/{id}
```

### ایجاد گروه حساب جدید
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/CreateAccountGroup
```

**بعد:**
```
POST http://localhost:5000/api/AccountGroups
```

### ویرایش گروه حساب
**قبل:**
```
PUT https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/EditAccountGroup
```

**بعد:**
```
PUT http://localhost:5000/api/AccountGroups
```

### تغییر وضعیت گروه حساب
**قبل:**
```
PUT https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/ChangeAccountGroupStatus
```

**بعد:**
```
PUT http://localhost:5000/api/AccountGroups/status
```

### حذف گروه حساب
**قبل:**
```
DELETE https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/DeleteAccountGroups/{id}
```

**بعد:**
```
DELETE http://localhost:5000/api/AccountGroups/{id}
```

### افزودن حساب‌ها به گروه
**قبل:**
```
POST https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/AddGroupAccounts
```

**بعد:**
```
POST http://localhost:5000/api/AccountGroups/accounts
```

### حذف حساب از گروه
**قبل:**
```
DELETE https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/ManageAccount/RemoveItem/{itemId}
```

**بعد:**
```
DELETE http://localhost:5000/api/AccountGroups/accounts/{itemId}
```

---

## User Profile (پروفایل کاربر)

### دریافت اطلاعات کاربر
**قبل:**
```
GET https://si-lab-idp.etadbir.com/connect/userinfo
```

**بعد:**
```
GET http://localhost:5000/api/UserProfile
```

---

## نکات مهم

### 1. Authorization Header
در هر درخواست باید header زیر ارسال شود:
```
Authorization: Bearer {accessToken}
```

### 2. تغییرات در کد Next.js

فایل‌های زیر باید به‌روزرسانی شوند:

#### `services/paymentOrdersService.ts`
```typescript
// قبل
const response = await apiClient.post<PaymentListResponse>(
  `/v1-Cartable/Withdrawal/Search`,
  requestBody,
  ...
);

// بعد
const response = await apiClient.post<PaymentListResponse>(
  `/PaymentOrders/search`,
  requestBody,
  ...
);
```

#### `services/accountService.ts`
```typescript
// قبل
const response = await apiClient.get<AccountListItem[]>(
  "/v1-Cartable/ManageAccount/GetList",
  ...
);

// بعد
const response = await apiClient.get<AccountListItem[]>(
  "/Accounts",
  ...
);
```

#### `services/cartableService.ts`
```typescript
// قبل
const response = await apiClient.post<PaymentListResponse>(
  `/v1-Cartable/Approver/ApproverCartable`,
  requestBody,
  ...
);

// بعد
const response = await apiClient.post<PaymentListResponse>(
  `/Cartable/approver-cartable`,
  requestBody,
  ...
);
```

### 3. تفاوت‌های Response

Response format تغییر نکرده و همان است، فقط از طریق BFF proxy می‌شود.

### 4. Error Handling

BFF خطاها را به همان صورت قبل برمی‌گرداند، اما یک لایه اضافی logging دارد.

---

## مثال کامل تغییرات در یک سرویس

### قبل - `paymentOrdersService.ts`

```typescript
export const searchPaymentOrders = async (
  params: CartableFilterParams,
  accessToken: string
): Promise<PaymentListResponse> => {
  const response = await apiClient.post<PaymentListResponse>(
    `/v1-Cartable/Withdrawal/Search`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
```

### بعد - `paymentOrdersService.ts`

```typescript
export const searchPaymentOrders = async (
  params: CartableFilterParams,
  accessToken: string
): Promise<PaymentListResponse> => {
  const response = await apiClient.post<PaymentListResponse>(
    `/PaymentOrders/search`, // ✅ فقط این خط تغییر کرده
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
```

---

## Checklist تغییرات

- [ ] به‌روزرسانی `.env.local` با آدرس BFF
- [ ] به‌روزرسانی `paymentOrdersService.ts`
- [ ] به‌روزرسانی `accountService.ts`
- [ ] به‌روزرسانی `accountGroupService.ts`
- [ ] به‌روزرسانی `cartableService.ts`
- [ ] به‌روزرسانی `transactionService.ts`
- [ ] به‌روزرسانی `managerCartableService.ts`
- [ ] به‌روزرسانی `dashboardService.ts`
- [ ] به‌روزرسانی `badgeService.ts`
- [ ] تست همه endpoint‌ها
- [ ] بررسی error handling
- [ ] بررسی authentication flow
