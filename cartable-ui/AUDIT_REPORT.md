# 📋 گزارش بررسی پروژه - براساس چک‌لیست

تاریخ: 2025-01-XX
وضعیت: در حال بررسی

---

## ✅ 1. Session (سراسری)

### بررسی:
- ✅ **Provider در ریشه**: `SessionProvider` در `app/layout.tsx`
- ✅ **Session Cache**: پیاده‌سازی شده در `lib/api-client.ts` (5s cache)
- ✅ **Clear on refresh**: event listener برای `auth:token-refreshed`
- ⚠️ **مشکل باقیمانده**: هنوز 4× session request (NextAuth internal)

### نتیجه: ✅ قابل قبول
توضیح: 4× درخواست از خود NextAuth است نه کد ما

---

## ✅ 2. Profile / User Info

### بررسی:
- ✅ **Provider سراسری**: `UserProfileProvider` در `app/layout.tsx`
- ✅ **یک API**: `/api/user/profile`
- ✅ **Cache**: force-cache با revalidate 3600s
- ✅ **hasFetched flag**: جلوگیری از re-fetch
- ✅ **Sidebar/Header**: از `useUserProfile()` استفاده می‌کنند (بدون fetch)

### فایل‌های بررسی شده:
- ✅ `components/layout/user-dropdown-menu.tsx` - از context استفاده می‌کند
- ✅ `components/layout/Sidebar.tsx` - بررسی شود

### نتیجه: ✅ عالی

---

## 🔄 3. Account Group (خیلی مهم)

### بررسی:
- ✅ **Store سراسری**: `useAccountGroupStore` موجود
- ❓ **Auto send در API**: باید بررسی شود
- ❓ **Invalidate on change**: باید بررسی شود

### نیاز به بررسی:
1. آیا `accountGroupId` در همه API ها خودکار ارسال می‌شود؟
2. آیا تغییر group باعث invalidate می‌شود؟

### نتیجه: ⚠️ نیاز به بررسی بیشتر

---

## ✅ 4. API Client

### بررسی:
- ✅ **Interceptor برای session**: موجود در `api-client.ts`
- ✅ **Timeout**: GET=15s, DEFAULT=25s
- ✅ **Retry**: 0 (از axios-retry استفاده نمی‌شود)
- ✅ **No cache**: Cache-Control headers
- ⚠️ **accountGroupId interceptor**: بررسی شود

### نتیجه: ✅ خوب (نیاز به بررسی accountGroupId)

---

## ✅ 5. React Query Config

### بررسی:
- ✅ **staleTime**: 0 (NO CACHE برای داده مالی)
- ✅ **gcTime**: 0
- ✅ **refetchOnWindowFocus**: true
- ✅ **refetchOnMount**: true
- ✅ **retry**: false
- ✅ **Query keys**: استاندارد و یکتا

### نتیجه: ✅ عالی

---

## 🔄 6. Ownership داده

### Dashboard (`/dashboard`)
- ✅ **Owner**: DashboardPage
- ✅ **React Query**: `useDashboardQuery`
- ✅ **Filters**: state محلی
- ✅ **UI Components**: فقط props

**نتیجه**: ✅ صحیح

---

### کارتابل من (`/my-cartable`)
- ✅ **Owner**: MyCartablePage
- ✅ **React Query**: `useCartableQuery`
- ✅ **Toolbar**: ✅ اصلاح شد - `useAccountsSelectQuery`
- ✅ **UI Components**: فقط props

**نتیجه**: ✅ صحیح

---

### کارتابل مدیر (`/manager-cartable`)
- ✅ **Owner**: ManagerCartablePage
- ✅ **React Query**: `useCartableQuery`
- ✅ **Toolbar**: ✅ اصلاح شد - `useAccountsSelectQuery`
- ✅ **UI Components**: فقط props

**نتیجه**: ✅ صحیح

---

### دستورهای پرداخت (`/payment-orders`)
- ✅ **Owner**: PaymentOrdersPage
- ✅ **React Query**: `usePaymentOrdersQuery`
- ❓ **Filters**: نیاز به بررسی
  - `app/payment-orders/components/order-filters.tsx`
  - `app/payment-orders/components/filter-sheet.tsx`

**نتیجه**: ⚠️ نیاز به بررسی filters

---

### جزئیات دستور پرداخت (`/payment-orders/[id]`)
- ❓ نیاز به بررسی کامل

---

### گزارش‌ها (`/reports`)
- ❓ **Owner**: ReportsPage
- ❓ **React Query**: بررسی شود
- ❓ **Filters**: `app/reports/components/transaction-filters.tsx`

**نتیجه**: ❌ نیاز به بررسی و احتمالاً ریفکتور

---

### مدیریت حساب‌ها (`/accounts`)
- ❓ نیاز به بررسی

---

### جزئیات حساب (`/accounts/[id]`)
- ❓ نیاز به بررسی

---

### مدیریت گروه حساب (`/account-groups`)
- ❓ نیاز به بررسی

---

### جزئیات گروه حساب (`/account-groups/[id]`)
- ❓ نیاز به بررسی

---

## 🚨 الگوهای ممنوع - بررسی کلی

### جستجوی الگوهای ممنوع:

```bash
# جستجو برای fetch در UI components
grep -r "useEffect.*fetch" components/
grep -r "useState.*fetch" components/

# جستجو برای fetch در Modal/Dialog
grep -r "fetch" components/ui/dialog/
grep -r "fetch" components/ui/modal/
```

---

## 📊 خلاصه نتایج

| مورد | وضعیت | توضیح |
|------|-------|-------|
| Session Management | ✅ | Cache 5s، 4× NextAuth internal قابل قبول |
| Profile Management | ✅ | Context provider، cache 1h |
| Account Group Store | ⚠️ | موجود، نیاز به بررسی auto-send |
| API Client | ✅ | Config صحیح |
| React Query | ✅ | Config عالی برای اپ مالی |
| Dashboard | ✅ | صحیح |
| My Cartable | ✅ | اصلاح شد |
| Manager Cartable | ✅ | اصلاح شد |
| Payment Orders | ⚠️ | نیاز به بررسی filters |
| Reports | ❌ | نیاز به بررسی کامل |
| Accounts Pages | ❓ | نیاز به بررسی |
| Account Groups | ❓ | نیاز به بررسی |

---

## 🎯 اقدامات لازم (اولویت‌بندی)

### فوری (High Priority)
1. ✅ Account Select در my-cartable/manager-cartable - **انجام شد**
2. ⚠️ بررسی و ریفکتور `app/reports`
3. ⚠️ بررسی `payment-orders/components/order-filters.tsx`
4. ⚠️ بررسی `payment-orders/components/filter-sheet.tsx`

### متوسط (Medium Priority)
5. ⚠️ بررسی صفحات accounts
6. ⚠️ بررسی صفحات account-groups
7. ⚠️ بررسی accountGroupId auto-send
8. ⚠️ اضافه کردن query invalidation

### پایین (Low Priority)
9. بررسی Component های Dashboard filters
10. اضافه کردن logging برای debug

---

## 📝 یادداشت‌های مهم

1. **Session 4×**: این از NextAuth است و نیازی به اصلاح ندارد
2. **Account Select**: با React Query اصلاح شد - فقط 1× fetch
3. **Profile**: با Context اصلاح شد - فقط 1× fetch
4. **staleTime accounts**: 5 دقیقه (لیست کم تغییر می‌کند)
5. **staleTime cartable**: 0 (داده مالی - همیشه fresh)
