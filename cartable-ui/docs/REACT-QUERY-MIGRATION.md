# React Query Migration - مهاجرت به React Query

## 📋 خلاصه

مهاجرت کامل سیستم مدیریت داده‌ها از `useState` + `useEffect` به **React Query** برای یکپارچه‌سازی و بهینه‌سازی fetch کردن داده‌ها در پروژه Cartable-UI.

## ✅ مراحل انجام شده

### 1. نصب و پیکربندی اولیه React Query

#### نصب پکیج‌ها:
```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

#### فایل‌های ایجاد شده:

##### `lib/react-query.ts`
- **QueryClient** با تنظیمات بهینه‌شده برای PWA
- **Query Keys** استاندارد برای تمام صفحات
- تنظیمات:
  - `staleTime`: 30 ثانیه
  - `gcTime`: 5 دقیقه
  - `retry`: false (axios-retry مدیریت می‌کند)
  - `refetchOnWindowFocus`: false
  - `refetchOnReconnect`: true

##### `components/providers/query-provider.tsx`
- Provider برای React Query
- شامل DevTools برای development
- Client-side component

##### `app/layout.tsx`
- اضافه شدن `<QueryProvider>` به root layout
- قرار گرفته بعد از `<SessionProvider>` و قبل از `<ThemeProvider>`

### 2. مهاجرت صفحه داشبورد ✅

#### فایل‌های تغییر یافته:

##### `hooks/useDashboardQuery.ts` (جدید)
```typescript
export function useDashboardQuery({
  filters: DashboardFilterParams,
  enabled?: boolean
}): {
  data: TransactionProgressResponse | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}
```

**قابلیت‌ها:**
- مدیریت خودکار caching
- Automatic refetch با تغییر filters
- Error handling یکپارچه
- Helper function: `getDefaultDashboardFilters()`

##### `app/dashboard/page.tsx`
**قبل:** 228 خط
**بعد:** 201 خط (27 خط کمتر)

**تغییرات:**
- حذف `useState` برای loading, error, data
- حذف `useEffect` برای fetch
- حذف تابع `fetchDashboardData`
- جایگزینی با: `useDashboardQuery({ filters })`

### 3. مهاجرت صفحات کارتابل ✅

#### فایل‌های تغییر یافته:

##### `hooks/useCartableQuery.ts` (جدید)
```typescript
export function useCartableQuery({
  fetchFunction: CartableFetchFunction,
  cartableType: "my" | "manager",
  pageSize?: number
}): {
  orders: PaymentOrder[]
  isLoading: boolean
  error: Error | null
  pageNumber: number
  totalItems: number
  totalPages: number
  setPageNumber: (page: number) => void
  reloadData: () => Promise<void>
}
```

**قابلیت‌ها:**
- پشتیبانی از هر دو کارتابل (my و manager)
- مدیریت pagination
- همگام‌سازی با localStorage برای accountGroupId
- Map خودکار داده‌ها با `mapPaymentListDtosToPaymentOrders`

##### `app/my-cartable/page.tsx`
**تغییرات:**
- تغییر import از `useCartableData` به `useCartableQuery`
- اضافه شدن پارامتر `cartableType: "my"`
- مدیریت error به صورت یکپارچه

##### `app/manager-cartable/page.tsx`
**تغییرات:**
- تغییر import از `useCartableData` به `useCartableQuery`
- اضافه شدن پارامتر `cartableType: "manager"`
- مدیریت error به صورت یکپارچه

### 4. ساخت Hook برای Payment Orders ✅

##### `hooks/usePaymentOrdersQuery.ts` (جدید)
```typescript
export function usePaymentOrdersQuery({
  filterParams: CartableFilterParams,
  enabled?: boolean
}): {
  orders: PaymentOrder[]
  isLoading: boolean
  error: Error | null
  totalItems: number
  totalPages: number
  refetch: () => Promise<void>
}
```

**قابلیت‌ها:**
- پشتیبانی از 11 فیلتر مختلف
- Pagination و sorting
- Search با trackingId, orderId, name, sourceIban
- فیلتر بر اساس status, dates, bankGateway, accountGroup

## 🎯 مزایای React Query

### 1. کاهش کد تکراری
- حذف `useState` برای loading, error, data
- حذف `useEffect` برای fetch
- حذف توابع fetch دستی

### 2. Automatic Caching
- Cache هوشمند بر اساس query keys
- جلوگیری از fetch‌های اضافی
- Stale-while-revalidate strategy

### 3. Background Refetching
- Refetch خودکار با reconnect
- عدم refetch با window focus (بهینه برای PWA)
- Polling در صورت نیاز

### 4. مدیریت بهتر خطا
- Error handling یکپارچه
- Retry توسط axios-retry
- Error boundaries سازگار

### 5. DevTools
- نمایش تمام queries
- وضعیت cache
- Timeline برای debug

## 📊 آمار تغییرات

### فایل‌های جدید:
- `lib/react-query.ts` (88 خط)
- `components/providers/query-provider.tsx` (29 خط)
- `hooks/useDashboardQuery.ts` (91 خط)
- `hooks/useCartableQuery.ts` (166 خط)
- `hooks/usePaymentOrdersQuery.ts` (135 خط)
- **جمع:** 509 خط کد جدید

### فایل‌های تغییر یافته:
- `app/layout.tsx`: +2 خط (اضافه شدن QueryProvider)
- `app/dashboard/page.tsx`: -27 خط
- `app/my-cartable/page.tsx`: ~10 خط تغییر
- `app/manager-cartable/page.tsx`: ~10 خط تغییر

### Build Status:
✅ **موفق** - بدون خطا یا warning
- Compile time: 17.5s
- Total routes: 16
- Build size: بدون تغییر قابل توجه

## 📝 صفحات باقی‌مانده برای مهاجرت

### 1. Payment Orders Page (در حال انجام)
- ❌ `app/payment-orders/page.tsx` نیاز به refactor دارد
- ✅ Hook ساخته شده: `usePaymentOrdersQuery`
- **پیچیدگی:** متوسط (11 فیلتر، pagination، sorting)
- **اولویت:** بالا

### 2. Reports Page
- ❌ `app/reports/page.tsx` نیاز به refactor دارد
- ❌ Hook نیاز است: `useReportsQuery`
- **پیچیدگی:** بالا (12 فیلتر، export functionality)
- **اولویت:** بالا

### 3. Account Groups Page
- ❌ `app/account-groups/page.tsx` نیاز به refactor دارد
- ❌ Hook نیاز است: `useAccountGroupsQuery`
- **پیچیدگی:** متوسط (CRUD operations)
- **اولویت:** متوسط

### 4. Accounts Page
- ❌ `app/accounts/page.tsx` نیاز به refactor دارد
- ❌ Hook نیاز است: `useAccountsQuery`
- **پیچیدگی:** پایین (client-side filtering)
- **اولویت:** پایین

## 🔄 الگوی مهاجرت

### قبل از React Query:
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await apiCall(params);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [params]);
```

### بعد از React Query:
```typescript
const { data, isLoading, error, refetch } = useCustomQuery({
  params
});
```

## 🚀 مراحل بعدی

### 1. تکمیل Payment Orders (فوری)
- Refactor کردن `payment-orders/page.tsx`
- استفاده از `usePaymentOrdersQuery`
- Test و verify

### 2. Reports Page (بالا)
- ساخت `useReportsQuery` hook
- مدیریت 12 فیلتر و export
- Refactor `reports/page.tsx`

### 3. Account Groups & Accounts (متوسط)
- ساخت hooks مربوطه
- Refactor صفحات
- مدیریت CRUD operations

### 4. حذف Custom Hook قدیمی
- حذف `hooks/useCartableData.ts` (دیگر استفاده نمی‌شود)
- Update documentation

### 5. بهینه‌سازی‌های اضافی
- Prefetching برای صفحات مرتبط
- Optimistic updates برای mutations
- Infinite scrolling (در صورت نیاز)

## 🎓 نکات مهم

### Query Keys
- همیشه از `queryKeys` از `lib/react-query.ts` استفاده کنید
- Query key باید شامل تمام dependencies باشد
- برای invalidation از query keys استفاده کنید

### Caching Strategy
- `staleTime`: 30s - برای داده‌های کم‌تغییر
- `gcTime`: 5min - برای نگهداری cache
- `refetchOnWindowFocus`: false - بهینه برای PWA

### Error Handling
- همیشه از `getErrorMessage()` استفاده کنید
- React Query error را به string تبدیل کنید
- ErrorState component برای نمایش خطا

### Pagination
- State pagination در component
- Query parameters شامل pageNumber و pageSize
- Automatic refetch با تغییر صفحه

## 📚 منابع

- [React Query Documentation](https://tanstack.com/query/latest)
- [TanStack Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Cartable-UI API Documentation](./API-DOCUMENTATION.md)

## ✅ Checklist پروژه

- [x] نصب React Query
- [x] پیکربندی QueryClient
- [x] Setup QueryProvider در layout
- [x] مهاجرت Dashboard
- [x] مهاجرت My Cartable
- [x] مهاجرت Manager Cartable
- [x] ساخت Hook برای Payment Orders
- [ ] Refactor Payment Orders Page
- [ ] ساخت Hook برای Reports
- [ ] Refactor Reports Page
- [ ] ساخت Hook برای Account Groups
- [ ] Refactor Account Groups Page
- [ ] ساخت Hook برای Accounts
- [ ] Refactor Accounts Page
- [ ] حذف custom hooks قدیمی
- [ ] Final testing و verification

---

**تاریخ شروع:** 2025-12-17
**وضعیت:** در حال انجام (50% تکمیل)
**آخرین بروزرسانی:** 2025-12-17
