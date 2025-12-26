# 🔧 پلن ریفکتور اپ مالی - کاهش درخواست‌های تکراری

## وضعیت فعلی
```
✅ Session Cache: پیاده‌سازی شده (5s cache)
✅ User Profile Context: پیاده‌سازی شده
✅ Account Service Bug: حل شده
✅ React Query Config: تنظیم شده (staleTime: 0, gcTime: 0)
❌ Account Select: هنوز fetch مستقیم در toolbar
❌ Session: هنوز 4× درخواست (NextAuth internal)
```

---

## 📋 چک‌لیست ریفکتور

### ✅ 1. Session Management (انجام شده)
- [x] Session cache در api-client.ts (5s)
- [x] Clear cache on token refresh
- [ ] بررسی چرا session هنوز 4× است

### ✅ 2. Profile Management (انجام شده)
- [x] UserProfileProvider
- [x] استفاده در UserDropdownMenu
- [x] Cache 1 ساعت (force-cache)
- [x] hasFetched flag برای جلوگیری از re-fetch

### ✅ 3. Account Service (انجام شده)
- [x] حذف session.accessToken از AccountSelector
- [x] حذف session.accessToken از my-cartable toolbar
- [x] حذف session.accessToken از manager-cartable toolbar

### 🔄 4. Account Select با React Query (در حال انجام)
**هدف**: یک بار fetch، همه جا استفاده

#### فایل‌های نیاز به تغییر:
- [ ] `hooks/useAccountsSelectQuery.ts` ✅ ایجاد شد
- [ ] `app/my-cartable/components/data-table-toolbar.tsx`
- [ ] `app/manager-cartable/components/data-table-toolbar.tsx`
- [ ] `app/reports/components/transaction-filters.tsx`
- [ ] `app/payment-orders/components/order-filters.tsx`
- [ ] `app/payment-orders/components/filter-sheet.tsx`
- [ ] `components/dashboard/DashboardFilters.tsx`
- [ ] `components/common/AccountSelector.tsx`

**تغییر مورد نیاز**:
```typescript
// ❌ قبل
const [accounts, setAccounts] = useState([]);
useEffect(() => {
  const fetchAccounts = async () => {
    const response = await getAccountsSelectData(...);
    setAccounts(response.results);
  };
  fetchAccounts();
}, [session?.accessToken]);

// ✅ بعد
const { accounts, isLoading } = useAccountsSelectQuery();
```

---

## 📊 صفحات - بررسی Ownership

### ✅ Dashboard (`/dashboard`)
- [x] Owner: DashboardPage
- [x] React Query: useDashboardQuery
- [x] Filters: local state
- [x] وابستگی: accountGroupId

### ✅ کارتابل من (`/my-cartable`)
- [x] Owner: MyCartablePage
- [x] React Query: useCartableQuery
- [x] Toolbar: ❌ fetch مستقیم accounts → باید React Query شود

### ✅ کارتابل مدیر (`/manager-cartable`)
- [x] Owner: ManagerCartablePage
- [x] React Query: useCartableQuery
- [x] Toolbar: ❌ fetch مستقیم accounts → باید React Query شود

### ✅ دستورهای پرداخت (`/payment-orders`)
- [x] Owner: PaymentOrdersPage
- [x] React Query: usePaymentOrdersQuery
- [x] Filters: ❌ احتمالاً fetch مستقیم → بررسی شود

### 🔄 گزارش‌ها (`/reports`) - نیاز به بررسی
- [ ] Owner: ReportsPage
- [ ] React Query: بررسی شود
- [ ] Filters: ❌ احتمالاً fetch مستقیم

### 🔄 مدیریت حساب‌ها (`/accounts`) - نیاز به بررسی
- [ ] Owner: AccountsPage
- [ ] React Query: بررسی شود
- [ ] وابستگی groupId: بررسی شود

### 🔄 جزئیات حساب (`/accounts/[id]`) - نیاز به بررسی
- [ ] Owner: AccountDetailsPage
- [ ] React Query: بررسی شود
- [ ] Mutations: بررسی شود

### 🔄 مدیریت گروه حساب (`/account-groups`) - نیاز به بررسی
- [ ] Owner: AccountGroupsPage
- [ ] React Query: بررسی شود

### 🔄 جزئیات گروه حساب (`/account-groups/[id]`) - نیاز به بررسی
- [ ] Owner: AccountGroupDetailsPage
- [ ] React Query: بررسی شود
- [ ] Mutations: بررسی شود

---

## 🎯 اولویت‌های کاری

### فاز 1: Account Select ریفکتور (اولویت بالا)
1. ✅ ایجاد `useAccountsSelectQuery`
2. ✅ اضافه کردن query key
3. [ ] جایگزینی در تمام 8 فایل
4. [ ] تست و بررسی

### فاز 2: بررسی Session (اولویت متوسط)
1. [ ] بررسی چرا 4× درخواست session
2. [ ] NextAuth config چک شود
3. [ ] ممکن است نیاز به تغییر نباشد (internal NextAuth)

### فاز 3: بررسی صفحات باقیمانده
1. [ ] Reports page
2. [ ] Accounts pages
3. [ ] Account Groups pages

### فاز 4: بهینه‌سازی نهایی
1. [ ] حذف همه useEffect برای fetch
2. [ ] همه به React Query
3. [ ] Invalidation صحیح بعد از mutations

---

## 📈 نتیجه مورد انتظار

### قبل از ریفکتور
```
my-cartable صفحه load:
- session: 4×
- profile: 3×
- AccountSelect: 2×
- approver-cartable: 1×
جمع: 10+ درخواست
```

### بعد از ریفکتور (هدف)
```
my-cartable صفحه load:
- session: 1× (shared, cached)
- profile: 1× (shared, cached)
- AccountSelect: 1× (shared, React Query)
- approver-cartable: 1×
جمع: 4 درخواست ✅
```

---

## 🚨 قوانین طلایی (NEVER)

### ❌ ممنوع در کل پروژه:
1. `useEffect(() => { fetch() }, [session])` در UI components
2. Fetch مستقیم در Sidebar/Header/Menu
3. Fetch در Modal/Dialog
4. Fetch در Table Row
5. State محلی برای session/profile/groupId
6. API call بدون `enabled` check

### ✅ الگوی صحیح:
1. Owner page: React Query
2. UI components: فقط props
3. Shared data: Context یا React Query
4. Mutations: invalidate queries

---

## 📝 یادداشت‌ها

- staleTime accounts: 5 دقیقه (لیست کم تغییر می‌کند)
- staleTime cartable: 0 (داده مالی)
- cache profile: 1 ساعت (critical نیست)
- session cache: 5 ثانیه (برای performance)
