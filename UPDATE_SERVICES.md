# راهنمای به‌روزرسانی Services برای استفاده از BFF

این فایل شامل تمام تغییراتی است که باید در فایل‌های service انجام شود.

## 🎯 وضعیت کلی پیاده‌سازی BFF

### ✅ BFF Endpoints پیاده‌سازی شده

تمام endpoint های زیر در BFF پیاده‌سازی شده و آماده استفاده هستند:

#### 1. PaymentOrders (`/api/PaymentOrders`)
- ✅ `POST /api/PaymentOrders/search` - جستجوی دستورات پرداخت
- ✅ `GET /api/PaymentOrders/{id}` - جزئیات دستور پرداخت
- ✅ `GET /api/PaymentOrders/{id}/statistics` - آمار دستور پرداخت
- ✅ `GET /api/PaymentOrders/{id}/inquiry` - استعلام دستور پرداخت
- ✅ `POST /api/PaymentOrders/{id}/send-to-bank` - ارسال به بانک

#### 2. Accounts (`/api/Accounts`)
- ✅ `GET /api/Accounts` - لیست حساب‌ها (با فیلتر accountGroupId)
- ✅ `GET /api/Accounts/{id}` - جزئیات حساب
- ✅ `POST /api/Accounts/change-minimum-signature` - تغییر حداقل امضا
- ✅ `POST /api/Accounts/add-signer` - افزودن امضادار
- ✅ `GET /api/Accounts/users` - لیست کاربران
- ✅ `POST /api/Accounts/signers/{signerId}/disable` - غیرفعال کردن امضادار
- ✅ `POST /api/Accounts/signers/{signerId}/enable` - فعال کردن امضادار
- ✅ `POST /api/Accounts/AccountSelect` - انتخاب حساب (Select2)

#### 3. AccountGroups (`/api/AccountGroups`)
- ✅ `GET /api/AccountGroups` - لیست گروه‌های حساب
- ✅ `POST /api/AccountGroups/filter` - فیلتر گروه‌های حساب
- ✅ `GET /api/AccountGroups/{id}` - جزئیات گروه
- ✅ `POST /api/AccountGroups` - ایجاد گروه جدید
- ✅ `PUT /api/AccountGroups` - ویرایش گروه
- ✅ `PUT /api/AccountGroups/status` - تغییر وضعیت
- ✅ `DELETE /api/AccountGroups/{id}` - حذف گروه
- ✅ `POST /api/AccountGroups/accounts` - افزودن حساب‌ها به گروه
- ✅ `DELETE /api/AccountGroups/accounts/{itemId}` - حذف حساب از گروه

#### 4. Cartable (`/api/Cartable`)
- ✅ `POST /api/Cartable/approver-cartable` - کارتابل امضادار
- ✅ `POST /api/Cartable/send-otp` - ارسال OTP
- ✅ `POST /api/Cartable/approve` - تایید/رد پرداخت
- ✅ `POST /api/Cartable/send-batch-otp` - ارسال OTP گروهی
- ✅ `POST /api/Cartable/batch-approve` - تایید/رد گروهی

#### 5. ManagerCartable (`/api/ManagerCartable`) - **جدید**
- ✅ `POST /api/ManagerCartable/manager-cartable` - کارتابل مدیر
- ✅ `POST /api/ManagerCartable/send-otp` - ارسال OTP
- ✅ `POST /api/ManagerCartable/approve` - تایید/رد توسط مدیر
- ✅ `POST /api/ManagerCartable/send-batch-otp` - ارسال OTP گروهی
- ✅ `POST /api/ManagerCartable/batch-approve` - تایید/رد گروهی

#### 6. Transaction (`/api/Transaction`) - **جدید**
- ✅ `POST /api/Transaction/paged` - لیست تراکنش‌ها
- ✅ `POST /api/Transaction/export` - خروجی اکسل تراکنش‌ها

#### 7. Dashboard (`/api/Dashboard`) - **جدید**
- ✅ `POST /api/Dashboard/transaction-progress` - آمار داشبورد

#### 8. Badge (`/api/Badge`) - **جدید**
- ✅ `GET /api/Badge/menu-counts` - تعداد آیتم‌های منو

#### 9. UserProfile (`/api/UserProfile`)
- ✅ `GET /api/UserProfile` - اطلاعات کاربر

---

## 📝 تغییرات مورد نیاز در Frontend Services

### 1. `services/paymentOrdersService.ts`

#### ✅ انجام شده
```typescript
// searchPaymentOrders
const response = await apiClient.post<PaymentListResponse>(
  `/api/PaymentOrders/search`,  // ✅ تغییر یافته
  requestBody,
  { headers: { Authorization: `Bearer ${accessToken}` } }
);

// getWithdrawalOrderDetails
const response = await apiClient.get<WithdrawalOrderDetails>(
  `/api/PaymentOrders/${id}`,  // ✅ تغییر یافته
  { headers: { Authorization: `Bearer ${accessToken}` } }
);

// getWithdrawalStatistics
const response = await apiClient.get<WithdrawalStatistics>(
  `/api/PaymentOrders/${id}/statistics`,  // ✅ تغییر یافته
  { headers: { Authorization: `Bearer ${accessToken}` } }
);
```

#### 🔄 نیاز به تغییر
```typescript
// inquiryOrderById
// قبل:
await apiClient.get(`/v1-Cartable/Withdrawal/InquiryById/${orderId}`, ...);
// بعد:
await apiClient.get(`/api/PaymentOrders/${orderId}/inquiry`, ...);

// sendToBank
// قبل:
await apiClient.post(`/v1-Cartable/Withdrawal/SendToBank/${orderId}`, {}, ...);
// بعد:
await apiClient.post(`/api/PaymentOrders/${orderId}/send-to-bank`, {}, ...);
```

---

### 2. `services/accountService.ts`

#### 🔄 تمام endpoint ها نیاز به تغییر دارند

```typescript
// getAccountsList
// قبل:
let url = "/v1-Cartable/ManageAccount/GetList";
// بعد:
let url = "/api/Accounts";

// getAccountDetail
// قبل:
const response = await apiClient.get(`/v1-Cartable/ManageAccount/${id}/find`, ...);
// بعد:
const response = await apiClient.get(`/api/Accounts/${id}`, ...);

// changeMinimumSignature
// قبل:
const response = await apiClient.post("/v1-Cartable/ManageAccount/ChangeMinimumSignature", params, ...);
// بعد:
const response = await apiClient.post("/api/Accounts/change-minimum-signature", params, ...);

// addSigner
// قبل:
const response = await apiClient.post("/v1-Cartable/ManageAccount", params, ...);
// بعد:
const response = await apiClient.post("/api/Accounts/add-signer", params, ...);

// getUsersList
// قبل:
const response = await apiClient.get("/v1-Cartable/ManageAccount/GetUsers", ...);
// بعد:
const response = await apiClient.get("/api/Accounts/users", ...);

// disableSigner
// قبل:
const response = await apiClient.post(`/v1-Cartable/ManageAccount/DisableApproverStatus/${signerId}`, {}, ...);
// بعد:
const response = await apiClient.post(`/api/Accounts/signers/${signerId}/disable`, {}, ...);

// enableSigner
// قبل:
const response = await apiClient.post(`/v1-Cartable/ManageAccount/EnableApproverStatus/${signerId}`, {}, ...);
// بعد:
const response = await apiClient.post(`/api/Accounts/signers/${signerId}/enable`, {}, ...);

// getAccountsSelectData (اگر استفاده می‌شود)
// قبل:
const response = await apiClient.post("/v1-Cartable/ManageAccount/SelectData", ...);
// بعد:
const response = await apiClient.post("/api/Accounts/AccountSelect", ...);
```

---

### 3. `services/cartableService.ts`

#### 🔄 تمام endpoint ها نیاز به تغییر دارند

```typescript
// getApproverCartable
// قبل:
const response = await apiClient.post(`/v1-Cartable/Approver/ApproverCartable`, requestBody, ...);
// بعد:
const response = await apiClient.post(`/api/Cartable/approver-cartable`, requestBody, ...);

// sendOperationOtp
// قبل:
const response = await apiClient.post(`/v1-Cartable/Approver/SendOperationOtp`, request, ...);
// بعد:
const response = await apiClient.post(`/api/Cartable/send-otp`, request, ...);

// approvePayment
// قبل:
const response = await apiClient.post(`/v1-Cartable/Approver/Approve`, request, ...);
// بعد:
const response = await apiClient.post(`/api/Cartable/approve`, request, ...);

// sendBatchOperationOtp
// قبل:
const response = await apiClient.post(`/v1-Cartable/Approver/SendBatchOperationOtp`, request, ...);
// بعد:
const response = await apiClient.post(`/api/Cartable/send-batch-otp`, request, ...);

// batchApprovePayments
// قبل:
const response = await apiClient.post(`/v1-Cartable/Approver/BatchApprove`, request, ...);
// بعد:
const response = await apiClient.post(`/api/Cartable/batch-approve`, request, ...);
```

---

### 4. `services/managerCartableService.ts`

#### 🔄 تمام endpoint ها نیاز به تغییر دارند

```typescript
// getManagerCartable
// قبل:
const response = await apiClient.post(`/v1-Cartable/Manager/ManagerCartable`, requestBody, ...);
// بعد:
const response = await apiClient.post(`/api/ManagerCartable/manager-cartable`, requestBody, ...);

// sendManagerOperationOtp
// قبل:
const response = await apiClient.post(`/v1-Cartable/Manager/SendOperationOtp`, request, ...);
// بعد:
const response = await apiClient.post(`/api/ManagerCartable/send-otp`, request, ...);

// managerApprovePayment
// قبل:
const response = await apiClient.post(`/v1-Cartable/Manager/Approve`, request, ...);
// بعد:
const response = await apiClient.post(`/api/ManagerCartable/approve`, request, ...);

// sendManagerBatchOperationOtp
// قبل:
const response = await apiClient.post(`/v1-Cartable/Manager/SendBatchOperationOtp`, request, ...);
// بعد:
const response = await apiClient.post(`/api/ManagerCartable/send-batch-otp`, request, ...);

// managerBatchApprovePayments
// قبل:
const response = await apiClient.post(`/v1-Cartable/Manager/BatchApprove`, request, ...);
// بعد:
const response = await apiClient.post(`/api/ManagerCartable/batch-approve`, request, ...);
```

---

### 5. `services/transactionService.ts`

#### 🔄 تمام endpoint ها نیاز به تغییر دارند

```typescript
// getTransactionsList
// قبل:
const response = await apiClient.post("/v1-Cartable/Withdrawal/withdrawal-transactions/paged", request, ...);
// بعد:
const response = await apiClient.post("/api/Transaction/paged", request, ...);

// exportTransactionsToExcel
// قبل:
const response = await apiClient.post("/v1-Cartable/Withdrawal/withdrawal-transactions/export", request, ...);
// بعد:
const response = await apiClient.post("/api/Transaction/export", request, ...);
```

---

### 6. `services/dashboardService.ts`

#### 🔄 نیاز به تغییر

```typescript
// getTransactionProgress
// قبل:
const response = await apiClient.post("/v1-Cartable/Withdrawal/transaction-progress", params, ...);
// بعد:
const response = await apiClient.post("/api/Dashboard/transaction-progress", params, ...);
```

---

### 7. `services/badgeService.ts`

#### 🔄 نیاز به تغییر

```typescript
// getMenuCounts
// قبل:
const response = await apiClient.get(`/v1/Badge/MenuCounts`, ...);
// بعد:
const response = await apiClient.get(`/api/Badge/menu-counts`, ...);
```

---

### 8. `services/accountGroupService.ts`

#### 🔄 تمام endpoint ها نیاز به تغییر دارند

```typescript
// getAccountGroups
// قبل:
const response = await apiClient.get("/v1-Cartable/ManageAccount/GetAccountGroups", ...);
// بعد:
const response = await apiClient.get("/api/AccountGroups", ...);

// filterAccountGroups
// قبل:
const response = await apiClient.post("/v1-Cartable/ManageAccount/FilterAccountGroups", params, ...);
// بعد:
const response = await apiClient.post("/api/AccountGroups/filter", params, ...);

// getAccountGroupById
// قبل:
const response = await apiClient.get(`/v1-Cartable/ManageAccount/GetAccountGroupById/${id}`, ...);
// بعد:
const response = await apiClient.get(`/api/AccountGroups/${id}`, ...);

// createAccountGroup
// قبل:
const response = await apiClient.post("/v1-Cartable/ManageAccount/CreateAccountGroup", request, ...);
// بعد:
const response = await apiClient.post("/api/AccountGroups", request, ...);

// editAccountGroup
// قبل:
const response = await apiClient.put("/v1-Cartable/ManageAccount/EditAccountGroup", request, ...);
// بعد:
const response = await apiClient.put("/api/AccountGroups", request, ...);

// changeAccountGroupStatus
// قبل:
const response = await apiClient.put("/v1-Cartable/ManageAccount/ChangeAccountGroupStatus", request, ...);
// بعد:
const response = await apiClient.put("/api/AccountGroups/status", request, ...);

// deleteAccountGroup
// قبل:
const response = await apiClient.delete(`/v1-Cartable/ManageAccount/DeleteAccountGroups/${id}`, ...);
// بعد:
const response = await apiClient.delete(`/api/AccountGroups/${id}`, ...);

// addGroupAccounts
// قبل:
const response = await apiClient.post("/v1-Cartable/ManageAccount/AddGroupAccounts", request, ...);
// بعد:
const response = await apiClient.post("/api/AccountGroups/accounts", request, ...);

// removeGroupAccount
// قبل:
const response = await apiClient.delete(`/v1-Cartable/ManageAccount/RemoveItem/${itemId}`, ...);
// بعد:
const response = await apiClient.delete(`/api/AccountGroups/accounts/${itemId}`, ...);
```

---

## 📋 چک لیست به‌روزرسانی

### مرحله 1: تنظیمات اولیه
- [ ] ✅ `.env.local` را به‌روز کنید (BASE_URL را به آدرس BFF تغییر دهید)
- [ ] ✅ BFF را اجرا کنید (`dotnet run` در پوشه SI.Cartable.BFF)

### مرحله 2: به‌روزرسانی Services
- [ ] `paymentOrdersService.ts` - تغییر endpoint ها به `/api/PaymentOrders/*`
- [ ] `accountService.ts` - تغییر endpoint ها به `/api/Accounts/*`
- [ ] `cartableService.ts` - تغییر endpoint ها به `/api/Cartable/*`
- [ ] `managerCartableService.ts` - تغییر endpoint ها به `/api/ManagerCartable/*`
- [ ] `transactionService.ts` - تغییر endpoint ها به `/api/Transaction/*`
- [ ] `dashboardService.ts` - تغییر endpoint ها به `/api/Dashboard/*`
- [ ] `badgeService.ts` - تغییر endpoint ها به `/api/Badge/*`
- [ ] `accountGroupService.ts` - تغییر endpoint ها به `/api/AccountGroups/*`

### مرحله 3: تست
- [ ] تست صفحه Dashboard
- [ ] تست صفحه Payment Orders
- [ ] تست صفحه Transactions
- [ ] تست صفحه Accounts
- [ ] تست صفحه Account Groups
- [ ] تست کارتابل امضادار
- [ ] تست کارتابل مدیر
- [ ] تست عملیات تایید/رد
- [ ] تست خروجی اکسل

### مرحله 4: بررسی Error Handling
- [ ] بررسی نمایش خطاها در UI
- [ ] تست اتصال ناموفق به BFF
- [ ] تست Token منقضی شده
- [ ] تست خطاهای 400, 401, 403, 404, 500

---

## 🔧 نکات فنی مهم

### 1. Base URL
همه endpoint ها باید با `/api/` شروع شوند:
```typescript
// ❌ اشتباه
const url = "/PaymentOrders/search";

// ✅ صحیح
const url = "/api/PaymentOrders/search";
```

### 2. Authorization Header
Token ها همانطور که هستند ارسال می‌شوند:
```typescript
headers: {
  Authorization: `Bearer ${accessToken}`
}
```

### 3. Error Handling
BFF خطاها را با ساختار زیر برمی‌گرداند:
```json
{
  "isSuccess": false,
  "message": "خطای فارسی",
  "statusCode": 400
}
```

### 4. نام‌گذاری Endpoint ها
- استفاده از kebab-case: `approver-cartable`, `send-otp`
- استفاده از جمع برای collection ها: `Accounts`, `PaymentOrders`
- استفاده از مفرد برای resource ها: `Accounts/{id}`

---

## ⚠️ نکات امنیتی

1. **هرگز BASE_URL را در کد هاردکد نکنید** - از متغیرهای محیطی استفاده کنید
2. **همیشه Token را در Header ارسال کنید** - نه در URL یا Body
3. **BFF باید در محیط امن اجرا شود** - استفاده از HTTPS الزامی است
4. **تنظیمات CORS** را بررسی کنید

---

## 🚀 راه‌اندازی سریع

### 1. تغییر .env.local
```bash
# قبل
NEXT_PUBLIC_API_BASE_URL=https://si-lab-tadbirpay.etadbir.com/api

# بعد
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
# یا در production:
NEXT_PUBLIC_API_BASE_URL=https://your-bff-domain.com/api
```

### 2. اجرای BFF
```bash
cd SI.Cartable.BFF
dotnet run
```

### 3. اجرای Frontend
```bash
cd cartable-ui
npm run dev
```

---

## 📊 جدول مقایسه URL ها

| سرویس | URL قدیم (TadbirPay) | URL جدید (BFF) | وضعیت |
|-------|---------------------|----------------|--------|
| Payment Orders Search | `/v1-Cartable/Withdrawal/Search` | `/api/PaymentOrders/search` | ✅ |
| Payment Order Details | `/v1-Cartable/Withdrawal/{id}/find` | `/api/PaymentOrders/{id}` | ✅ |
| Accounts List | `/v1-Cartable/ManageAccount/GetList` | `/api/Accounts` | ✅ |
| Account Details | `/v1-Cartable/ManageAccount/{id}/find` | `/api/Accounts/{id}` | ✅ |
| Approver Cartable | `/v1-Cartable/Approver/ApproverCartable` | `/api/Cartable/approver-cartable` | ✅ |
| Manager Cartable | `/v1-Cartable/Manager/ManagerCartable` | `/api/ManagerCartable/manager-cartable` | ✅ |
| Transactions | `/v1-Cartable/Withdrawal/withdrawal-transactions/paged` | `/api/Transaction/paged` | ✅ |
| Dashboard | `/v1-Cartable/Withdrawal/transaction-progress` | `/api/Dashboard/transaction-progress` | ✅ |
| Badge Counts | `/v1/Badge/MenuCounts` | `/api/Badge/menu-counts` | ✅ |

---

## 🎉 مزایای استفاده از BFF

1. ✅ **Error Handling یکپارچه** - همه خطاها با فرمت استاندارد و پیام‌های فارسی
2. ✅ **Security** - Token ها فقط بین Frontend و BFF رد و بدل می‌شوند
3. ✅ **Performance** - امکان اضافه کردن Cache و Rate Limiting
4. ✅ **Maintainability** - تغییرات Backend بدون تاثیر روی Frontend
5. ✅ **Type Safety** - مدل‌های C# با validation کامل
6. ✅ **Logging** - لاگ مرکزی تمام درخواست‌ها

---

## 🐛 عیب‌یابی رایج

### مشکل: BFF در دسترس نیست
**راه حل:** مطمئن شوید BFF در حال اجرا است: `dotnet run` در پوشه SI.Cartable.BFF

### مشکل: CORS Error
**راه حل:** بررسی کنید که URL فرانت‌اند در `appsettings.json` در لیست `AllowedOrigins` باشد

### مشکل: 401 Unauthorized
**راه حل:** بررسی کنید Token معتبر است و در Header به درستی ارسال می‌شود

### مشکل: 404 Not Found
**راه حل:** بررسی کنید URL با `/api/` شروع شود و endpoint نام صحیح داشته باشد

---

**آخرین به‌روزرسانی:** اسفند 1403
**نسخه BFF:** 1.0.0
**وضعیت:** ✅ تمام endpoint ها آماده استفاده
