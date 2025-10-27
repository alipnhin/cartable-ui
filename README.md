# 📦 Phase 0.5: Types & Mock Data - راهنمای استفاده

## 📋 فهرست محتویات

این پکیج شامل موارد زیر است:

### 1️⃣ Types (TypeScript Type Definitions)
```
types/
├── common.ts        - انواع مشترک (Pagination, ApiResponse, etc.)
├── user.ts          - User, UserRole
├── account.ts       - Account, AccountGroup, AccountStatus
├── order.ts         - PaymentOrder, OrderStatus
├── transaction.ts   - Transaction, TransactionStatus
├── signer.ts        - Approver, SignatureProgress
├── chart.ts         - ChartData برای نمودارها
└── index.ts         - Export همه
```

### 2️⃣ Mock Data
```
mocks/
├── mockUsers.ts          - 12 کاربر نمونه
├── mockAccounts.ts       - 5 حساب بانکی
├── mockTransactions.ts   - تولید تراکنش‌های دینامیک
├── mockOrders.ts         - 25 دستور پرداخت
├── mockSigners.ts        - امضاکنندگان و پیشرفت
├── mockChangeHistory.ts  - تاریخچه تغییرات
└── index.ts              - Export همه
```

### 3️⃣ Services
```
services/
└── authService.ts   - سرویس احراز هویت (Login, OTP, Logout)
```

### 4️⃣ Documentation
- `PHASE_0.5_SUMMARY.md` - خلاصه کامل Phase 0.5
- `PROJECT_PROGRESS_UPDATED.md` - وضعیت پیشرفت پروژه

---

## 🚀 نحوه استفاده

### نصب در پروژه Next.js

1. فایل ZIP را extract کنید
2. پوشه‌ها را در ریشه پروژه Next.js کپی کنید:

```bash
# ساختار پیشنهادی:
your-project/
├── app/
├── components/
├── types/          # ← کپی کنید
├── mocks/          # ← کپی کنید
├── services/       # ← کپی کنید
└── lib/
```

3. اگر از `@/` alias استفاده می‌کنید، مطمئن شوید `tsconfig.json` شما شامل:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📚 مثال‌های استفاده

### 1. استفاده از Types

```typescript
import { PaymentOrder, OrderStatus, User } from "@/types";

const order: PaymentOrder = {
  id: "order-1",
  orderId: "WO-1403-0001",
  title: "پرداخت حقوق",
  status: OrderStatus.WaitingForOwnersApproval,
  // ... بقیه فیلدها
};
```

### 2. استفاده از Mock Data

```typescript
import { mockOrders, getOrderDetailById, filterOrders } from "@/mocks";

// همه دستورات
console.log(mockOrders);

// جزئیات یک دستور
const detail = getOrderDetailById("order-1");
console.log(detail?.transactions); // لیست تراکنش‌ها
console.log(detail?.approvers);    // لیست امضاکنندگان

// فیلتر کردن
const filtered = filterOrders({
  statuses: [OrderStatus.WaitingForOwnersApproval],
  minAmount: 100000000,
  searchQuery: "حقوق"
});
```

### 3. استفاده از Auth Service

```typescript
import { login, verifyOTP, getCurrentUser } from "@/services/authService";

// Login
const loginResult = await login("admin", "123456", "captcha");
if (loginResult.success && loginResult.data?.requireOTP) {
  // نمایش صفحه OTP
}

// Verify OTP
const otpResult = await verifyOTP("123456"); // کد معتبر
if (otpResult.success) {
  const user = otpResult.data?.user;
  // redirect به dashboard
}

// بررسی login بودن
const currentUser = getCurrentUser();
if (currentUser) {
  console.log(`خوش آمدید ${currentUser.fullName}`);
}
```

### 4. استفاده در Component

```typescript
"use client";

import { useState, useEffect } from "react";
import { mockOrders, getOrdersByStatus } from "@/mocks";
import { OrderStatus } from "@/types";

export default function MyCartablePage() {
  const [orders, setOrders] = useState(mockOrders);

  // فیلتر دستورات نیازمند تأیید
  useEffect(() => {
    const pending = getOrdersByStatus(OrderStatus.WaitingForOwnersApproval);
    setOrders(pending);
  }, []);

  return (
    <div>
      <h1>کارتابل من ({orders.length})</h1>
      {orders.map(order => (
        <div key={order.id}>
          <h3>{order.title}</h3>
          <p>{order.totalAmount.toLocaleString()} ریال</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Helper Functions مهم

### mockOrders
- `getOrderById(id)` - یک دستور
- `getOrderDetailById(id)` - جزئیات کامل با transactions, approvers, history
- `getOrdersByStatus(status)` - فیلتر بر اساس وضعیت
- `getOrdersForApproval(userId)` - دستورات نیازمند تأیید
- `filterOrders(filters)` - فیلتر پیشرفته
- `getOrderStatistics()` - آمار کلی

### mockTransactions
- `getTransactionById(id)`
- `getTransactionsByOrderId(orderId)`
- `calculateOrderTotalAmount(orderId)`
- `countSuccessfulTransactions(orderId)`

### mockAccounts
- `getAccountById(id)`
- `getAccountsByGroup(groupId)`
- `getActiveAccounts()`
- `getAccountsBySignerId(userId)`

### mockUsers
- `getUserById(id)`
- `getUserByUsername(username)`
- `getActiveUsers()`
- `CURRENT_USER` - کاربر فعلی (برای تست)

---

## 🔐 اطلاعات تست

### Login
- **Username:** هر چیزی (مثلا `admin`)
- **Password:** هر چیزی (مثلا `123456`)
- **Captcha:** هر چیزی

### OTP
- **کد معتبر:** `123456`

### Current User
- کاربر پیش‌فرض: `user-1` (محمد رضایی - SuperAdmin)

---

## 📊 آمار Data

- 👥 **Users:** 12 کاربر
- 🏦 **Accounts:** 5 حساب بانکی در 2 گروه
- 📋 **Orders:** 25 دستور پرداخت
- 💳 **Transactions:** 125-375 تراکنش
- ✍️ **Change History:** کامل برای هر دستور

---

## ⚠️ نکات مهم

1. **هیچ API واقعی فراخوانی نمی‌شود** - همه client-side است
2. **Delays شبیه‌سازی شده** - برای تجربه واقع‌گرایانه
3. **Session Storage** - برای نگهداری login state
4. **Helper Functions** - حتماً از آنها استفاده کنید
5. **getOrderDetailById()** - برای صفحه جزئیات خیلی کامل است

---

## 🐛 مشکلات احتمالی

### ارور import
اگر ارور import گرفتید:
```typescript
// به جای:
import { mockOrders } from "mocks";

// استفاده کنید:
import { mockOrders } from "@/mocks";
```

### ارور Type
اگر TypeScript شکایت می‌کند:
```bash
# مطمئن شوید تمام types import شده‌اند:
import { PaymentOrder, OrderStatus } from "@/types";
```

### Window is not defined (SSR)
اگر از auth service در SSR استفاده می‌کنید:
```typescript
// به component خود "use client" اضافه کنید
"use client";

import { getCurrentUser } from "@/services/authService";
```

---

## 📞 پشتیبانی

برای سوالات یا مشکلات:
1. مستندات کامل: `PHASE_0.5_SUMMARY.md`
2. وضعیت پروژه: `PROJECT_PROGRESS_UPDATED.md`

---

## 🎉 آماده برای Phase 1!

حالا می‌توانید شروع به ساخت کامپوننت‌های Layout کنید:
- AppLayout
- Header
- Sidebar
- BottomDock
- PageHeader

موفق باشید! 🚀
